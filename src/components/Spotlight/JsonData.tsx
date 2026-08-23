function createJsonSections(profile: {
  funFact?: string;
  favCourse?: string;
  leastFavCourse?: string;
  favLecturer?: string;
  favYoutubeTutor?: string;
  whatDoYouDo?: string;
  bestExpOnCampus?: string;
  worstExpOnCampus?: string;
  ifNotCSC?: string;
  unexpectedExp?: string;
  hotTake?: string;
  journeyInOneWord?: string;
  overallOauExperience?: string;
  favQuote?: string;
  shoutout?: string;
}) {
  return [
    {
      startNumber: 2,
      lines: [
        ["fun_fact", profile.funFact],
      ],
    },

    {
      startNumber: 3,
      lines: [
        ["fav_course", profile.favCourse],
        ["least_fav_course", profile.leastFavCourse],
        ["fav_lecturer", profile.favLecturer],
        ["fav_youtube_tutor", profile.favYoutubeTutor],
      ],
    },

    {
      startNumber: 7,
      lines: [
        ["what_do_you_do", profile.whatDoYouDo],
        ["best_exp_on_campus", profile.bestExpOnCampus],
        ["worst_exp_on_campus", profile.worstExpOnCampus],
        ["if_not_csc", profile.ifNotCSC],
      ],
    },

    {
      startNumber: 11,
      lines: [
        ["unexpected_exp", profile.unexpectedExp],
        ["hot_take", profile.hotTake],
        ["journey_in_one_word", profile.journeyInOneWord],
        ["overall_oau_experience", profile.overallOauExperience],
      ],
    },

    {
      startNumber: 15,
      lines: [
        ["fav_quote", profile.favQuote],
        ["shoutout", profile.shoutout],
      ],
    },
  ];
}

export default createJsonSections;