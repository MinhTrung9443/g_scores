class Subject {
  constructor(code, name) {
    this.code = code;
    this.name = name;
  }

  isValidScore(score) {
    if (score === null || score === undefined) return true;
    return score >= 0 && score <= 10;
  }

  classifyScore(score) {
    if (score === null || score === undefined) {
      return null;
    }
    if (!this.isValidScore(score)) {
      throw new Error(`Invalid score for ${this.name}: ${score}`);
    }

    if (score >= 8) {
      return 'level1';
    } else if (score >= 6) {
      return 'level2';
    } else if (score >= 4) {
      return 'level3';
    } else {
      return 'level4';
    }
  }

  isGroupA() {
    return false; 
  }
}

class MathSubject extends Subject { 
  constructor() { super('math', 'Math'); } 
  isGroupA() { return true; } 
}
class PhysicsSubject extends Subject { 
  constructor() { super('physics', 'Physics'); } 
  isGroupA() { return true; } 
}
class ChemistrySubject extends Subject { 
  constructor() { super('chemistry', 'Chemistry'); } 
  isGroupA() { return true; } 
}
class LiteratureSubject extends Subject { constructor() { super('literature', 'Literature'); } }
class ForeignLanguageSubject extends Subject { constructor() { super('foreignLanguage', 'Foreign Language'); } }
class BiologySubject extends Subject { constructor() { super('biology', 'Biology'); } }
class HistorySubject extends Subject { constructor() { super('history', 'History'); } }
class GeographySubject extends Subject { constructor() { super('geography', 'Geography'); } }
class CivicEducationSubject extends Subject { constructor() { super('civicEducation', 'Civic Education'); } }

class SubjectRegistry {
  constructor() {
    this.subjects = new Map();
    this.register(new MathSubject());
    this.register(new PhysicsSubject());
    this.register(new ChemistrySubject());
    this.register(new LiteratureSubject());
    this.register(new ForeignLanguageSubject());
    this.register(new BiologySubject());
    this.register(new HistorySubject());
    this.register(new GeographySubject());
    this.register(new CivicEducationSubject());
  }

  register(subject) {
    this.subjects.set(subject.code, subject);
  }

  getSubject(code) {
    return this.subjects.get(code);
  }

  getAllSubjects() {
    return Array.from(this.subjects.values());
  }
}

module.exports = {
  Subject,
  SubjectRegistry
};
