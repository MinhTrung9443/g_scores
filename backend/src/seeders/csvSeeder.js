const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { sequelize, Student, Subject, Score, ReportGroupA } = require('../models');

const { SubjectRegistry } = require('../domain/subject.domain');

const BATCH_SIZE = 10000;

const parseScore = (val) => {
  if (!val || val.trim() === '') return null;
  const num = parseFloat(val);
  return isNaN(num) ? null : num;
};

const seed = () => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log('Syncing database...');
    await sequelize.sync({ force: true });
    
    console.log('Inserting subjects...');
    const registry = new SubjectRegistry();
    const subjectsToInsert = registry.getAllSubjects().map(s => ({
      code: s.code,
      name: s.name
    }));
    await Subject.bulkCreate(subjectsToInsert);

    const subjects = await Subject.findAll();
    const subjectMap = {};
    subjects.forEach(s => { subjectMap[s.code] = s.id; });

    const csvFilePath = path.resolve(__dirname, '../../../data/diem_thi_thpt_2024.csv');
    if (!fs.existsSync(csvFilePath)) {
      console.error(`CSV file not found at ${csvFilePath}`);
      return reject(new Error(`CSV file not found at ${csvFilePath}`));
    }

    let studentsBatch = [];
    let scoresBatch = [];
    let reportGroupABatch = [];
    let totalProcessed = 0;
    
    const insertBatches = async (students, scores, groupAReports) => {
      try {
        const insertedStudents = await Student.bulkCreate(students, {
          ignoreDuplicates: true,
          returning: true
        });
        
        const regToId = {};
        insertedStudents.forEach(s => {
          regToId[s.registration_number] = s.id;
        });

        const validScores = scores.filter(score => regToId[score.registration_number] !== undefined)
          .map(score => ({
            student_id: regToId[score.registration_number],
            subject_id: score.subject_id,
            score: score.score,
            score_level: score.score_level 
          }));

        await Score.bulkCreate(validScores);

        if (groupAReports && groupAReports.length > 0) {
          const validGroupA = groupAReports.filter(g => regToId[g.registration_number] !== undefined)
            .map(g => ({
              ...g,
              student_id: regToId[g.registration_number]
            }));
          await ReportGroupA.bulkCreate(validGroupA);
        }

      } catch (e) {
        console.error('Error inserting batch:', e);
      }
    };

    console.log('Reading CSV and importing data...');
    const stream = fs.createReadStream(csvFilePath).pipe(csv());

    stream.on('data', async (row) => {
      if (!row.sbd) return;
      const regNum = row.sbd.trim();

      studentsBatch.push({
        registration_number: regNum,
      });

      const addScore = (code, valStr) => {
        const score = parseScore(valStr);
        const subjectLogic = registry.getSubject(code);
        
        if (subjectLogic && subjectLogic.isValidScore(score) && score !== null) {
          scoresBatch.push({
            registration_number: regNum,
            subject_id: subjectMap[code],
            score: score,
            score_level: subjectLogic.classifyScore(score) 
          });
        }
      };

      addScore('math', row.toan);
      addScore('literature', row.ngu_van);
      addScore('foreignLanguage', row.ngoai_ngu);
      addScore('physics', row.vat_li);
      addScore('chemistry', row.hoa_hoc);
      addScore('biology', row.sinh_hoc);
      addScore('history', row.lich_su);
      addScore('geography', row.dia_li);
      addScore('civicEducation', row.gdcd);

      const mathScore = parseScore(row.toan);
      const physicsScore = parseScore(row.vat_li);
      const chemistryScore = parseScore(row.hoa_hoc);
      
      if (mathScore !== null && physicsScore !== null && chemistryScore !== null) {
        reportGroupABatch.push({
          registration_number: regNum,
          math: mathScore,
          physics: physicsScore,
          chemistry: chemistryScore,
          total: mathScore + physicsScore + chemistryScore
        });
      }

      if (studentsBatch.length >= BATCH_SIZE) {
        stream.pause();
        const sBatch = [...studentsBatch];
        const scBatch = [...scoresBatch];
        const rBatch = [...reportGroupABatch];
        studentsBatch = [];
        scoresBatch = [];
        reportGroupABatch = [];
        totalProcessed += sBatch.length;
        console.log(`Processed ${totalProcessed} records...`);

        insertBatches(sBatch, scBatch, rBatch).then(() => {
          stream.resume();
        }).catch(err => {
          console.error(err);
          stream.destroy(err);
        });
      }
    });

    stream.on('end', async () => {
      if (studentsBatch.length > 0) {
        totalProcessed += studentsBatch.length;
        await insertBatches(studentsBatch, scoresBatch, reportGroupABatch);
      }
      
      console.log(`Seed completed successfully! Total records processed: ${totalProcessed}`);
      resolve({ success: true, totalProcessed });
    });

    stream.on('error', (err) => {
      console.error('CSV processing error:', err);
      reject(err);
    });

  } catch (error) {
    console.error('Failed to seed database:', error);
    reject(error);
  }
  });
};

module.exports = { seed };

