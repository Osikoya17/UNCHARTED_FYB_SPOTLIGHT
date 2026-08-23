export interface SocialMedia {
  instagram: string;
  x: string;
  linkedin: string;
}

export interface Profile {
  fullName: string;
  surname: string;
  nickname: string;
  birthday: string;

  photo: string;
  throwbackPhoto: string;

  socialMedia: SocialMedia;

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