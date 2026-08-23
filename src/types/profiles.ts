export interface Profile {
  /** Full name (single column in the sheet — Nigerian names often list surname first). */
  fullName: string;
  nickname: string;
  birthday: string;

  photo: string;
  throwbackPhoto: string;

  /** Raw social handle/URL text as typed in the form (free-form, may be empty). */
  social: string;

  funFact: string;
  favCourse: string;
  leastFavCourse: string;
  favLecturer: string;
  favYoutubeTutor: string;

  whatDoYouDo: string;
  bestExpOnCampus: string;
  worstExpOnCampus: string;
  ifNotCSC: string;

  unexpectedExp: string;
  hotTake: string;
  journeyInOneWord: string;
  overallOauExperience: string;

  favQuote: string;
  shoutout: string;
}
