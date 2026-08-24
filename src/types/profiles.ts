export interface Profile {
  /** Surname, from the sheet's "Last name" column. Shown as the card's title. */
  lastname: string;
  /** Given name, from the sheet's "First name" column. */
  firstname: string;
  /**
   * "LASTNAME Firstname", used for slugs and download file names. Built from the
   * two columns above rather than the sheet's free-form "Full Name", which mixes
   * name orders and middle names from row to row. Falls back to "Full Name"
   * when both parts are blank.
   */
  fullName: string;

  nickname: string;
  /** Day and month only ("03/08") — the sheet's years are unreliable. */
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
