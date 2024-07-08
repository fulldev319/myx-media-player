const geoData = [
  {
    ADDRESS: 'W MARTIN LUTHER KING JR BLVD / NUECES ST',
    LATITUDE: 30.2822369,
    LONGITUDE: -97.74374779,
    TYPE: 'RADIO',
  },
  {
    ADDRESS: 'MANOR RD / ROGGE LN',
    LATITUDE: 30.3045501,
    LONGITUDE: -97.68131692,
    TYPE: 'USER_BOX',
  },
  {
    ADDRESS: 'WHELESS LN / LINDA LN',
    LATITUDE: 30.31470658,
    LONGITUDE: -97.68953997,
    TYPE: 'USER',
  },
  {
    ADDRESS: 'PROCK LN / SPRINGDALE RD',
    LATITUDE: 30.27070178,
    LONGITUDE: -97.69226286,
    TYPE: 'LISTENING',
  },
  // {
  //   "ADDRESS": "CARVER AVE / WILKS AVE",
  //   "LATITUDE": 30.33182207,
  //   "LONGITUDE": -97.69862095,
  //   "TYPE": 'RADIO'
  // },
  // {
  //   "ADDRESS": "E 6TH ST / COMAL ST",
  //   "LATITUDE": 30.2630675,
  //   "LONGITUDE": -97.72654446,
  //   "TYPE": 'USER_BOX'
  // },
  // {
  //   "ADDRESS": "E 9TH ST / N IH 35 SVRD SB",
  //   "LATITUDE": 30.26869438,
  //   "LONGITUDE": -97.73397487,
  //   "TYPE": 'USER'
  // },
  // {
  //   "ADDRESS": "COMAL ST / NASH HERNANDEZ SR RD",
  //   "LATITUDE": 30.25106283,
  //   "LONGITUDE": -97.73212105,
  //   "TYPE": 'LISTENING'
  // },
  // {
  //   "ADDRESS": "E 12TH ST / SALINA ST",
  //   "LATITUDE": 30.27365389,
  //   "LONGITUDE": -97.72088762,
  //   "TYPE": 'LISTENING'
  // },
  // {
  //   "ADDRESS": "E 12TH ST / HARGRAVE ST",
  //   "LATITUDE": 30.27570349,
  //   "LONGITUDE": -97.7077292,
  //   "TYPE": 'LISTENING'
  // },
  // {
  //   "ADDRESS": "E RIVERSIDE DR / CROSSING PL",
  //   "LATITUDE": 30.23163585,
  //   "LONGITUDE": -97.71746957,
  //   "TYPE": 'USER'
  // },
  // {
  //   "ADDRESS": "SENDERO HILLS PKWY / TOSCANA AVE",
  //   "LATITUDE": 30.28645744,
  //   "LONGITUDE": -97.64721293,
  //   "TYPE": 'USER_BOX'
  // },
  // {
  //   "ADDRESS": "AIRPORT BLVD / E 12TH ST",
  //   "LATITUDE": 30.27686098,
  //   "LONGITUDE": -97.70033651,
  //   "TYPE": 'RADIO'
  // },
  // {
  //   "ADDRESS": "E 12TH ST / CHICON ST",
  //   "LATITUDE": 30.27378531,
  //   "LONGITUDE": -97.71991443,
  //   "TYPE": 'RADIO'
  // },
  // {
  //   "ADDRESS": "S 1ST ST / LIGHTSEY RD",
  //   "LATITUDE": 30.23240908,
  //   "LONGITUDE": -97.76574127,
  //   "TYPE": 'USER_BOX'
  // },
  // {
  //   "ADDRESS": "LAKE CREEK PKWY / N US 183 HWY SVRD SB",
  //   "LATITUDE": 30.4611394,
  //   "LONGITUDE": -97.79458828,
  //   "TYPE": 'USER'
  // },
  // {
  //   "ADDRESS": "AIRPORT BLVD / OAK SPRINGS DR",
  //   "LATITUDE": 30.27355474,
  //   "LONGITUDE": -97.69791388,
  //   "TYPE": 'USER'
  // },
  // {
  //   "ADDRESS": "W BRAKER LN / N LAMAR BLVD",
  //   "LATITUDE": 30.38193221,
  //   "LONGITUDE": -97.68638032,
  //   "TYPE": 'LISTENING'
  // },

  // {
  //   "ADDRESS": "W 25TH ST / LONGVIEW ST",
  //   "LATITUDE": 30.28965289,
  //   "LONGITUDE": -97.75075248
  // },
  // {
  //   "ADDRESS": "E MARTIN LUTHER KING JR BLVD / COMAL ST",
  //   "LATITUDE": 30.27910379,
  //   "LONGITUDE": -97.72514489
  // },
  // {
  //   "ADDRESS": "BENNETT AVE / DELMAR AVE",
  //   "LATITUDE": 30.3343522,
  //   "LONGITUDE": -97.69834258
  // },
  // {
  //   "ADDRESS": "W 25TH ST / PEARL ST",
  //   "LATITUDE": 30.28945446,
  //   "LONGITUDE": -97.74664097
  // },
  // {
  //   "ADDRESS": "GUADALUPE ST / W 38TH ST",
  //   "LATITUDE": 30.30274027,
  //   "LONGITUDE": -97.73815152
  // },
  // {
  //   "ADDRESS": "E 7TH ST / CHICON ST",
  //   "LATITUDE": 30.26257583,
  //   "LONGITUDE": -97.72211887
  // },
  // {
  //   "ADDRESS": "HOWARD LN TO MOPAC SB RAMP / N MOPAC EXPY SB",
  //   "LATITUDE": 30.43313301,
  //   "LONGITUDE": -97.70013305
  // },
  // {
  //   "ADDRESS": "N IH 35 SVRD SB / E 6TH ST",
  //   "LATITUDE": 30.26587979,
  //   "LONGITUDE": -97.73501069
  // },
  // {
  //   "ADDRESS": "E 11TH ST / TRINITY ST",
  //   "LATITUDE": 30.27176241,
  //   "LONGITUDE": -97.73757106
  // },
  // {
  //   "ADDRESS": "E 8TH ST / RED RIVER ST",
  //   "LATITUDE": 30.26832192,
  //   "LONGITUDE": -97.73649438
  // },
  // {
  //   "ADDRESS": "E CESAR CHAVEZ ST / LYNN ST",
  //   "LATITUDE": 30.25666258,
  //   "LONGITUDE": -97.72333379
  // },
  // {
  //   "ADDRESS": "MOAT CV / PRINCE VALIANT DR",
  //   "LATITUDE": 30.19202606,
  //   "LONGITUDE": -97.79150611
  // },
  // {
  //   "ADDRESS": "E 6TH ST / NECHES ST",
  //   "LATITUDE": 30.26678161,
  //   "LONGITUDE": -97.73825313
  // },
  // {
  //   "ADDRESS": "HYRIDGE DR / MESA DR",
  //   "LATITUDE": 30.38022334,
  //   "LONGITUDE": -97.75083605
  // },
  // {
  //   "ADDRESS": "W 12TH ST / N LAMAR BLVD",
  //   "LATITUDE": 30.27689623,
  //   "LONGITUDE": -97.7514043
  // },
  // {
  //   "ADDRESS": "W MARTIN LUTHER KING JR BLVD / LAVACA ST",
  //   "LATITUDE": 30.28132717,
  //   "LONGITUDE": -97.74051451
  // },
  // {
  //   "ADDRESS": "MANOR RD / AIRPORT BLVD",
  //   "LATITUDE": 30.28629196,
  //   "LONGITUDE": -97.70636683
  // },
  // {
  //   "ADDRESS": "GROVE BLVD / MONTOPOLIS DR",
  //   "LATITUDE": 30.22020198,
  //   "LONGITUDE": -97.70708753
  // },
  // {
  //   "ADDRESS": "MEARNS MEADOW BLVD / RUTLAND DR",
  //   "LATITUDE": 30.36700221,
  //   "LONGITUDE": -97.70063501
  // },
  // {
  //   "ADDRESS": "CHESTNUT AVE / MANOR RD",
  //   "LATITUDE": 30.28445162,
  //   "LONGITUDE": -97.71818371
  // },
  // {
  //   "ADDRESS": "METRIC BLVD / W PARMER LN",
  //   "LATITUDE": 30.41323033,
  //   "LONGITUDE": -97.69058871
  // },
  // {
  //   "ADDRESS": "NORTH LAKE CREEK PKWY / N FM 620 RD SB",
  //   "LATITUDE": 30.47106155,
  //   "LONGITUDE": -97.79022767
  // },
  // {
  //   "ADDRESS": "E RIVERSIDE DR / WILLOW CREEK DR",
  //   "LATITUDE": 30.23767769,
  //   "LONGITUDE": -97.72566505
  // },
  // {
  //   "ADDRESS": "N IH 35 SVRD NB / E CESAR CHAVEZ ST",
  //   "LATITUDE": 30.26099452,
  //   "LONGITUDE": -97.73579167
  // },
  // {
  //   "ADDRESS": "UNKNOWN",
  //   "LATITUDE": 30.33058555,
  //   "LONGITUDE": -97.67615288
  // },
  // {
  //   "ADDRESS": "N LAMAR BLVD / ZENNIA ST",
  //   "LATITUDE": 30.31960289,
  //   "LONGITUDE": -97.73029552
  // },
  // {
  //   "ADDRESS": "GOBI DR / W STASSNEY LN",
  //   "LATITUDE": 30.21154625,
  //   "LONGITUDE": -97.78935848
  // },
  // {
  //   "ADDRESS": "E WILLIAM CANNON DR / BLUFF SPRINGS RD",
  //   "LATITUDE": 30.18919271,
  //   "LONGITUDE": -97.76789963
  // },
  // {
  //   "ADDRESS": "E 6TH ST / TRINITY ST",
  //   "LATITUDE": 30.26706768,
  //   "LONGITUDE": -97.73934174
  // },
  // {
  //   "ADDRESS": "DELONEY ST / E 12TH ST",
  //   "LATITUDE": 30.27806366,
  //   "LONGITUDE": -97.69275542
  // },
  // {
  //   "ADDRESS": "S 1ST ST / W BEN WHITE BLVD SVRD WB",
  //   "LATITUDE": 30.22687964,
  //   "LONGITUDE": -97.76924545
  // },
  // {
  //   "ADDRESS": "N IH 35 SVRD SB / E 38TH ST",
  //   "LATITUDE": 30.29430285,
  //   "LONGITUDE": -97.72017974
  // },
  // {
  //   "ADDRESS": "ROBERT T MARTINEZ JR ST / GARDEN ST",
  //   "LATITUDE": 30.25301269,
  //   "LONGITUDE": -97.72197515
  // },
  // {
  //   "ADDRESS": "TRINITY ST / E CESAR CHAVEZ ST",
  //   "LATITUDE": 30.26239435,
  //   "LONGITUDE": -97.74108315
  // },
  // {
  //   "ADDRESS": "GILES LN / E US 290 HWY SVRD WB",
  //   "LATITUDE": 30.3312282,
  //   "LONGITUDE": -97.62328346
  // },
  // {
  //   "ADDRESS": "OAK SPRINGS DR / TILLERY ST",
  //   "LATITUDE": 30.27336292,
  //   "LONGITUDE": -97.69915175
  // },
  // {
  //   "ADDRESS": "RED RIVER ST / E 8TH ST",
  //   "LATITUDE": 30.26832192,
  //   "LONGITUDE": -97.73649438
  // },
  // {
  //   "ADDRESS": "JOLLYVILLE RD / W BRAKER LN",
  //   "LATITUDE": 30.40069584,
  //   "LONGITUDE": -97.74886938
  // },
  // {
  //   "ADDRESS": "E 5TH ST / RED RIVER ST",
  //   "LATITUDE": 30.26553403,
  //   "LONGITUDE": -97.73749138
  // },
  // {
  //   "ADDRESS": "W KOENIG LN / N LAMAR BLVD",
  //   "LATITUDE": 30.32594189,
  //   "LONGITUDE": -97.72634218
  // },
  // {
  //   "ADDRESS": "W DITTMAR RD / LOGANBERRY DR",
  //   "LATITUDE": 30.18312987,
  //   "LONGITUDE": -97.78546886
  // },
  // {
  //   "ADDRESS": "W 5TH ST / LAVACA ST",
  //   "LATITUDE": 30.26779557,
  //   "LONGITUDE": -97.74555148
  // },
  // {
  //   "ADDRESS": "N US 183 HWY SVRD SB / POND SPRINGS RD",
  //   "LATITUDE": 30.43443516,
  //   "LONGITUDE": -97.77085536
  // },
  // {
  //   "ADDRESS": "N MOPAC EXPY SB / WESTOVER TO MOPAC SB RAMP",
  //   "LATITUDE": 30.29779189,
  //   "LONGITUDE": -97.75858202
  // },
  // {
  //   "ADDRESS": "E 6TH ST / N IH 35 SVRD NB",
  //   "LATITUDE": 30.26563526,
  //   "LONGITUDE": -97.73420932
  // },
  // {
  //   "ADDRESS": "W 25TH ST / LEON ST",
  //   "LATITUDE": 30.2895752,
  //   "LONGITUDE": -97.74921748
  // },
  // {
  //   "ADDRESS": "DUVAL RD / N MOPAC EXPY SVRD SB",
  //   "LATITUDE": 30.40905558,
  //   "LONGITUDE": -97.71610131
  // },
  // {
  //   "ADDRESS": "E 5TH ST / WALLER ST",
  //   "LATITUDE": 30.26351183,
  //   "LONGITUDE": -97.73094919
  // },
  // {
  //   "ADDRESS": "CAMERON RD / BROADMOOR DR",
  //   "LATITUDE": 30.31141872,
  //   "LONGITUDE": -97.70701102
  // },
  // {
  //   "ADDRESS": "E 51ST ST / ED BLUESTEIN BLVD NB",
  //   "LATITUDE": 30.29230132,
  //   "LONGITUDE": -97.66363247
  // },
  // {
  //   "ADDRESS": "FERGUSON LN / BROWN LN",
  //   "LATITUDE": 30.34486225,
  //   "LONGITUDE": -97.67413602
  // },
  // {
  //   "ADDRESS": "PRAIRIE TRL / PLAINS TRL",
  //   "LATITUDE": 30.38156086,
  //   "LONGITUDE": -97.69438785
  // },
  // {
  //   "ADDRESS": "E 7TH ST / TRINITY ST",
  //   "LATITUDE": 30.26800598,
  //   "LONGITUDE": -97.73895531
  // },
  // {
  //   "ADDRESS": "E 5TH ST / CONGRESS AVE",
  //   "LATITUDE": 30.26711778,
  //   "LONGITUDE": -97.74317744
  // },
  // {
  //   "ADDRESS": "RED RIVER ST / E 7TH ST",
  //   "LATITUDE": 30.26740172,
  //   "LONGITUDE": -97.73682331
  // },
  // {
  //   "ADDRESS": "E 51ST EB TO IH 35 SB RAMP / N IH 35 SB",
  //   "LATITUDE": 30.30741658,
  //   "LONGITUDE": -97.71183032
  // },
  // {
  //   "ADDRESS": "RED RIVER ST / E 12TH ST",
  //   "LATITUDE": 30.27231913,
  //   "LONGITUDE": -97.73504968
  // },
  // {
  //   "ADDRESS": "E RIVERSIDE DR / S IH 35 SVRD NB",
  //   "LATITUDE": 30.24784065,
  //   "LONGITUDE": -97.73489103
  // },
  // {
  //   "ADDRESS": "W 40TH ST / GUADALUPE ST",
  //   "LATITUDE": 30.30524327,
  //   "LONGITUDE": -97.73653103
  // },
  // {
  //   "ADDRESS": "W PARMER LN / N IH 35 SVRD NB",
  //   "LATITUDE": 30.40786174,
  //   "LONGITUDE": -97.67395623
  // },
  // {
  //   "ADDRESS": "NORTH LAKE CREEK PKWY / LAKELINE MALL DR",
  //   "LATITUDE": 30.47525495,
  //   "LONGITUDE": -97.79393686
  // },
  // {
  //   "ADDRESS": "W 7TH ST / NUECES ST",
  //   "LATITUDE": 30.27057478,
  //   "LONGITUDE": -97.74807207
  // },
  // {
  //   "ADDRESS": "N US 183 HWY SVRD NB / PECAN PARK BLVD",
  //   "LATITUDE": 30.46559711,
  //   "LONGITUDE": -97.79525504
  // },
  // {
  //   "ADDRESS": "S 1ST ST / CUMBERLAND RD",
  //   "LATITUDE": 30.23820265,
  //   "LONGITUDE": -97.76210929
  // },
  // {
  //   "ADDRESS": "S CONGRESS AVE / W WILLIAM CANNON DR",
  //   "LATITUDE": 30.19301239,
  //   "LONGITUDE": -97.77887935
  // },
  // {
  //   "ADDRESS": "WEBBERVILLE RD / GOODWIN AVE",
  //   "LATITUDE": 30.27132082,
  //   "LONGITUDE": -97.70551627
  // },
  // {
  //   "ADDRESS": "E 7TH ST / SAN MARCOS ST",
  //   "LATITUDE": 30.26602454,
  //   "LONGITUDE": -97.73211399
  // },
  // {
  //   "ADDRESS": "E SLAUGHTER LN / OLD LOCKHART RD",
  //   "LATITUDE": 30.15173968,
  //   "LONGITUDE": -97.76477325
  // },
  // {
  //   "ADDRESS": "E 8TH ST / CONGRESS AVE",
  //   "LATITUDE": 30.2699045,
  //   "LONGITUDE": -97.74212041
  // },
  // {
  //   "ADDRESS": "W 21ST ST / GUADALUPE ST",
  //   "LATITUDE": 30.283795,
  //   "LONGITUDE": -97.74191231
  // },
  // {
  //   "ADDRESS": "E 6TH ST / MEDINA",
  //   "LATITUDE": 30.26474531,
  //   "LONGITUDE": -97.73155596
  // },
  // {
  //   "ADDRESS": "CAMERON RD / E ST JOHNS AVE",
  //   "LATITUDE": 30.3260513,
  //   "LONGITUDE": -97.69231397
  // },
  // {
  //   "ADDRESS": "E 5TH ST / COMAL ST",
  //   "LATITUDE": 30.26214932,
  //   "LONGITUDE": -97.72697163
  // },
  // {
  //   "ADDRESS": "MANCHACA RD / PRATHER LN",
  //   "LATITUDE": 30.23381323,
  //   "LONGITUDE": -97.78578828
  // },
  // {
  //   "ADDRESS": "ED BLUESTEIN BLVD SB / BASTROP HWY SB",
  //   "LATITUDE": 30.24530991,
  //   "LONGITUDE": -97.69103765
  // },
  // {
  //   "ADDRESS": "CONGRESS AVE / W CESAR CHAVEZ ST",
  //   "LATITUDE": 30.26338078,
  //   "LONGITUDE": -97.74457355
  // },
  // {
  //   "ADDRESS": "W BEN WHITE BLVD SVRD EB / MANCHACA RD",
  //   "LATITUDE": 30.22963221,
  //   "LONGITUDE": -97.78852736
  // },
  // {
  //   "ADDRESS": "SPRINGDALE RD / E MARTIN LUTHER KING JR BLVD",
  //   "LATITUDE": 30.28586106,
  //   "LONGITUDE": -97.68263537
  // },
  // {
  //   "ADDRESS": "N LAMAR BLVD / W ELLIOTT ST",
  //   "LATITUDE": 30.35533845,
  //   "LONGITUDE": -97.70294185
  // },
  // {
  //   "ADDRESS": "AIRPORT BLVD / W HIGHLAND MALL BLVD",
  //   "LATITUDE": 30.32885517,
  //   "LONGITUDE": -97.71584509
  // },
  // {
  //   "ADDRESS": "NORTHLAND DR / N MOPAC EXPY SVRD SB",
  //   "LATITUDE": 30.33678302,
  //   "LONGITUDE": -97.75596236
  // },
  // {
  //   "ADDRESS": "MANOR RD / LOYOLA LN",
  //   "LATITUDE": 30.31005968,
  //   "LONGITUDE": -97.66715751
  // }
];

export default geoData;
