/*
 * ============================================================================
 *  CONFIGURATION FILE  —  EDIT THIS FILE TO CUSTOMISE THE APP
 * ============================================================================
 *
 *  Everything the doctor/clinic needs to personalise lives here:
 *    1. doctor         -> header & footer details on the printout
 *    2. investigations -> options for the "Investigation" multi-select
 *    3. medicineMap    -> category -> [subcategories] for the dependent dropdowns
 *
 *  No programming knowledge required — just change the text inside the quotes
 *  and the items inside the lists. Keep the punctuation (quotes, commas).
 * ============================================================================
 */

const CONFIG = {
  /* ----------------------------------------------------------------------
   * 1. DOCTOR / CLINIC DETAILS  (shown in the print header & footer)
   *
   *    The print header has THREE columns:
   *      - left   : doctor name, qualifications, designations
   *      - center : appointment contact
   *      - right  : clinic address & timings
   *
   *    Each "lines" list is printed one line per entry. Edit freely.
   * -------------------------------------------------------------------- */
  doctor: {
    // ----- LEFT column (doctor credentials) -----
    left: {
      name: "Prof. (Dr.) Lok Nath Sinha",
      // Printed right-aligned, just under the name:
      qualifications: "M.D., DTCD., Ph.D. (Card.)",
      // Printed left-aligned, below the qualifications:
      lines: [
        "Consultant Physician & Cardiologist",
        "Professor & Head (Rtd.)",
        "Deptt. of Medicine",
        "Patna Medical College & Hospital",
        "Reg. No. 9751 (Bihar)",
      ],
    },

    // ----- CENTER column (appointment) -----
    center: {
      title: "Contact for Appointment",
      label: "Mob :",
      numbers: [
        "7488127476",
        "9334120175",
      ],
    },

    // ----- RIGHT column (clinic & timings) -----
    right: {
      lines: [
        "Clinic :",
        "6, L.I.C. Colony",
        "Kankarbagh, Patna - 800020",
        "(behind Kendriya Vidyalaya)",
        "Mob : 8407833371, 7250434338",
        "Timing :",
        "Morning 9:30 AM to 1:00 PM",
        "Evening 6:00 PM to 7:30 PM",
      ],
    },

    // ----- FOOTER -----
    footerNote: "This is a computer-generated prescription.",
    signatureLabel: "Signature",
    signatureName: "Prof. (Dr.) Lok Nath Sinha",
  },

  /* ----------------------------------------------------------------------
   * 2. INVESTIGATIONS  (options for the Investigation multi-select)
   * -------------------------------------------------------------------- */
  investigations: [
    "25 OH (D3)",
    "AFP",
    "Alkaline Phosphatase",
    "Anti CCP",
    "AntiHBs",
    "AntiHBc Antigen",
    "AntiHBc IgG",
    "AntiHBc IgM",
    "Anti TPO",
    "Blood Group",
    "Blood Sugar 2 Hr after Meal & Drug",
    "Blood Sugar Fasting",
    "Blood Urea",
    "Bone Marrow Examination",
    "CA 125",
    "CA 15.3",
    "CA 19.9",
    "CEA",
    "CD Count",
    "Complete Blood Count (CBC)",
    "Coronary Angiography",
    "CRP",
    "CT Abdomen",
    "CT Brain",
    "ECG",
    "Echocardiography",
    "Elisa HIV",
    "Eenterocheck",
    "ESR",
    "FNAC",
    "FNAC cervical lymph nodes",
    "FNAC axillary lymph nodes",
    "FPSA",
    "FT3 FT4 TSH",
    "GGT",
    "Hb%",
    "HbA1c",
    "HBsAg",
    "HBsAg DNA",
    "HBV",
    "HCV",
    "Holter Monitoring",
    "HRCT Chest",
    "IgE",
    "IgM-Typhoid",
    "IgM IgG for Dengue & Below",
    "Immature Cells",
    "Lipid Profile",
    "MF",
    "Micral",
    "MP",
    "MRI Brain",
    "MRI Cervical Spines",
    "MRI Dorsal Spines",
    "NS1",
    "PSA",
    "Rheumatoid Factor",
    "Serum Amylase",
    "Serum B12",
    "Serum Bilirubin Direct Indirect",
    "Serum Calcium",
    "Serum Creatinine",
    "Serum Lipase",
    "Serum Oestrogen",
    "Serum Potassium",
    "Serum Sodium",
    "Serum Testosterone",
    "Serum Uric Acid",
    "SGPT, SGOT",
    "TMT",
    "Total Protein A:G",
    "Upper GI Endoscopy",
    "Urine Routine",
    "Urine C&S",
    "Urine Ketone Bodies",
    "Urine for Bence Jones Protein",
    "US Whole Abdomen",
    "US Thyroid",
    "US Scrotum",
    "US Cervical Glands",
    "US guided chest aspiration from Rt/Lt pleural space",
    "US guided aspiration of liver abscess",
    "WIDAL",
    "X-Ray Both Knees AP & Lateral View",
    "X-Ray Cervical Spine AP & Lateral View",
    "X-Ray Chest PA View",
    "X-Ray  Heel Lateral View",
    "X-Ray LS Spine AP & Lateral View",
    "X-Ray PNS AP View",
  ],

  /* ----------------------------------------------------------------------
   * 3. DOSAGE OPTIONS  (choices for the per-medicine dosage dropdown)
   *    Add, remove or reorder these freely.
   * -------------------------------------------------------------------- */
  dosageOptions: [
    "1-0-1",
    "1-0-0",
    "0-0-1",
    "1-1-1",
    "0-1-0",
    "1-1-1-1",
    "SOS",
    "HS",
    "S/L",
    "ES",
    "Once a week",
    "Before food",
    "After food",
  ],

  /* ----------------------------------------------------------------------
   * 4. EXERCISES  (options for the Exercises multi-select)
   * -------------------------------------------------------------------- */
  exercises: [
    "Back Muscle",
    "Cervical",
    "Effected Joints",
    "Elbow",
    "Facial",
    "Fingers",
    "Knee",
    "Shoulder",
  ],

  /* ----------------------------------------------------------------------
   * 5. ADVICE TEMPLATES  (quick-insert lines for the Advice box)
   *    Use "__" where the doctor should fill in a value before printing.
   * -------------------------------------------------------------------- */
  adviceTemplates: [
    "Follow up after   days / months",
    "Daily Walk   minutes",
    "Rest   days / months",
  ],

  /* ----------------------------------------------------------------------
   * 6. MEDICINE MAP  (Category -> list of Subcategories)
   *    The Subcategory dropdown shows only items for the chosen categories.
   * -------------------------------------------------------------------- */
  medicineMap: {
    Antacids: [
      "Digene gel",
      "Digene tab",
      "Mucain gel",
      "Penlife DSR cap",
      "Penlife L cap",
      "Suncid O",
    ],
    Antibiotics: [
      "Abhilife 625 mg tab",
      "Amikacin 500 mg inj vial im",
      "Ampilox 500 mg cap",
      "Azibeck 500 mg tab",
      "Cefotaxime 500 mg inj vial im",
      "Cefotaxime 1000 mg inj vial im",
      "Ceftum 500 mg tab",
      "Cifisin 200 mg tab",
      "Ciprofloxacin 500 mg tab",
      "Doxycycline 100 mg tab",
      "Gentamicin 80 mg inj vial im",
      "Levofloxacin 500 mg tab",
      "Levofloxacin 750 mg tab",
      "Monocef-O 200 mg tab",
      "Nitrofurantoin 100 mg tab",
      "Ofloxacin 200 mg tab",
      "Ofloxacin 400 mg tab",
    ],
    Antidepressants: [
      "Anxito 10 mg tab",
      "Anxito 25 mg tab",
      "Seicalm 10 mg tab",
      "Tryptomer 10 mg tab",
      "Zolax 0.5 mg tab",
    ],
    Antidiabetics: [
      "Actrapid inj s/c vial",
      "BigometSR 1000 mg tab",
      "BigometSR 500 mg tab",
      "Glimepiride 1 mg tab",
      "Glimepiride 2 mg tab",
      "Glimepiride 4 mg tab",
      "Gluflozin 10 mg tab",
      "Gluflozin 20 mg tab",
      "Lantus Insulin",
      "Megavog 0.3 mg tab",
      "Mixtard 30/70",
      "Piosafe 15 mg tab",
      "Piosafe 30 mg tab",
      "Seagli 2 mg tab",
      "Seagli 4 mg tab",
      "Sitaglo 100 mg tab",
      "Sitaglo 50 mg tab",
      "Vogformin 0.3 mg tab",
    ],
    Antidiarrheals: [
      "Cifisin OZ tab",
      "Flagyl 400 mg tab",
    ],
    Antiemetics: [
      "Dom DT tab",
      "Ondem inj amp",
      "Ondem tab",
      "Perinorm inj amp im",
      "Stemetil inj amp im",
    ],
    Antiepileptic: [
      "Calmpose inj amp im",
      "Dilantin 100 mg",
      "Epiliv 500 mg tab",
      "Mazetol 400 mg tab",
      "Valparin 200 mg tab",
    ],
    Antifilarial: [
      "Deecee forte tab",
      "Banocide 50 mg tab",
    ],
    Antihistamines: [
      "Bilast 20 mg tab",
      "Cetrizine 10 mg tab",
      "Cetrizine 20 mg tab",
      "ZinLM tab",
    ],
    Antihypertensives: [
      "Arkamin 0.1 mg tab",
      "Calaptin 40 mg tab",
      "Calaptin 80 mg tab",
      "Cilnidipine 10 mg tab",
      "Cilnidipine 20 mg tab",
      "Cilnidipine 5 mg tab",
      "Losartan 50 mg tab",
      "Methyl DOPA (alfa DOPA) 250 mg tab",
      "Myoprol XL 25 mg tab",
      "Myoprol XL 50 mg tab",
      "Nebi 5 mg tab",
      "S Amlosafe 5 tab",
      "Sealvas 50 mg tab",
      "Telbeck 40 mg tab",
    ],
    Antilipids: [
      "Rosact 10 mg tab",
      "Rosuvastatin 5 mg tab",
      "Rosuvastatin 10 mg tab",
      "Tonact 5 mg tab",
      "Tonact 10 mg tab",
      "Tonact EZ tab",
    ],
    AntiinflammatoryAnalgesicsAntipyretics: [
      "Crocin tab",
      "Chymoral forte tab",
      "Naprosyn 250 mg tab",
      "Naprosyn 500 mg tab",
      "Relaxtan tab",
      "Ultracet tab",
    ],
    Antioxidant: [
      "Sezox tab",
    ],
    AntiplateletAnticoagulant: [
      "Cloflow 75 mg tab",
      "Cloflow plus tab",
      "Ticabid 90 mg",
      "Brilenta 90 mg tab",
      "Pradexa 110 mg",
      "Pradexa 150 mg",
    ],
    Antispasmodics: [
      "Anafortan inj amp im",
      "Buscopan inj amp im",
      "Dilona inj amp im",
      "Din DS tab",
      "Drotin DS tab",
      "Meftal tab",
    ],
    Antituberculous: [
      "Ambistryn-S 0.75 gm inj vial im",
      "Ambistryn-S 1 gm inj vial im",
      "Ecox 1000 mg tab",
      "Ecox 500 mg tab",
      "Isonex forte 300 mg tab",
      "Macox plus 450 mg tab",
      "Macox plus 600mg tab",
      "Pyrazinamide 500 mg tab",
      "Pyrazinamide 750 mg tab",
      "Rifampicin 450 mg tab",
      "Rifampicin 600mg tab",
    ],
    Antihelminthic: [
      "Noworm tab",
      "Zentel tab",
    ],
    Antivertigo: [
      "Vertin 16 mg tab",
      "Vertistate 16 mg tab",
    ],
    Antiviral: [
      "Acivir 400 mg tab",
      "Acivir ointment",
      "Lamuvir 100 mg tab",
      "Lopinavir 200 mg + Ritonavir 50 mg",
    ],
    Appetiser: [
      "Practin tab",
      "Longifene tab",
    ],
    Bronchodilators: [
      "Aerocort inhalers puff",
      "Ambrodil XP cap",
      "Deriphyllin retd 150 mg tab",
      "Deriphyllin retd 300 mg tab",      
      "Nebulisation with Budacort & Duolin",
      "Oxygen inhalation",
    ],
    Calcium: [
      "Allecal tab",
      "Ostocalcium tab",
    ],
    Cardiac: [
      "Angispan TR 6.5 mg tab",
      "Apixator 2.5 mg tab",
      "Apixator 5 mg tab",
      "Cordarone 100 mg tab",
      "Cordarone 200 mg tab",
      "Lanoxin 0.25 mg tab",
      "Monotrate 20 mg tab",
      "NitrofixSR 60 mg tab",
      "Orni 50 mg tab",
      "Qcard 100 mg tab",
      "Ransun 500 mg tab",
      "Sorbitrate 5mg S/L tab",
      "Timzid MR 35mg tab",
    ],
    Corticosteroids: [
      "Dexona 4mg tab",
      "Dexona inj vial im/iv",
      "Efcorlin inj 100 mg vial im/iv",
      "Wysolone 10 mg tab",
      "Wysolone 5 mg tab",
    ],
    CoughSyrup: [
      "Ambrodil S Syrup 2 tsf",
      "Kodites 2 tsf",
    ],
    Dermal: [
      "Atrax lotion",
      "Betnovate cream/ointment",
      "Caladryl lotion",
      "Candid B lotion",
      "Griesofulvin 100 mg tab",
      "Ketomac shampoo",
      "Nizral shampoo",
      "Soframycin Ointment",
      "Zocon 200mg tab",
    ],
    Diuretics: [
      "Aldactone 100 mg tab",
      "Aldactone 25 mg tab",
      "Lasix 40 mg tab",
      "Lasix inj amp im/iv",
      "Torsid 10 mg tab",
      "Torsid 5 mg tab",
      "Torsid plus 5 tabs",
      "Torsid plus 50 tabs",
    ],
    Electrolytes: [
      "Electral Powder",
      "Hyponat 15 mg",
      "Hyponat 30 mg",
    ],
    Enzymes: [
      "Bekpin cap",
      "Lipase",
      "Neopeptin cap",
      "Pancreatin 10000 units",
      "Pancreatin 25000 units",
      "Seazyme Syrup 2 tsf",
      "Unienzyme tab",
    ],
    Haematinics: [
      "Bmack cap",
      "CB12 inj amp im",
      "Folvite tab",
      "Neurobion forte tab",
      "Spizer cap",
    ],
    IBS: [
      "Colospa",
    ],
    Laxative: [
      "Cremaffin pink syrup 2 tsf bedtime",
      "Cremaffin pink syrup 3 tsf bedtime",
      "Duphalac syrup 3 tsf bedtime",
      "Smuth syrup 3 tsf bedtime",
    ],
    LeukaemiaCML: [
      "Imatinib 400 mg tab",
    ],
    Nasaldrop: [
      "Otrivin nasal drop",
      "Otrivin nasal spray",
    ],
    Parkinsons: [
      "Pacitane 4 mg tab",
      "Syndopa 275 mg tab",
    ],
    Prostate: [
      "Dariff 7.5 mg tab",
      "Flodart Plus tab",
      "Flodart tab",
      "Tamisulin",
    ],
    Protein: [
      "Probeck powder",
    ],
    Thyroid: [
      "Eltroxin 100 mcg tab",
      "Eltroxin 125 mcg tab",
      "Eltroxin 25 mcg tab",
      "Eltroxin 50 mcg tab",
      "Neomercazole 10 mg tab",
      "Neomercazole 5 mg tab",
    ],
    UricAcidLowering: [
      "Febuget 40 mg tab",
      "Zyloric 100 mg tab",
    ],
    UrinaryAntispasmodic: [
      "Alkacitron syrup 2tsf",
      "Urispas tab",
    ],
    VitaminD3: [
      "Soulvita 1 tab",
    ],
    VitaminE: [
      "BioE 400 mg tab",
      "Ebeck 400 mg tab",
      "Evion 400 mg",
    ],
    Vitamins: [
      "Benadon 40 mg tab",
      "Berin inj amp im",
      "Cromoplex forte",
      "Retinol ointment",
      "Riboflavin tab",
      "Thiamin tab 100 mg",
      "Vitamin A tab",
    ],
  },
};
