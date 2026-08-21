/**
 * Import journals, conference papers, and book chapters into Strapi from
 * raw citation text blocks — all three share the same citation shape:
 *   [CODE#] "Title", authors and venue info, DOI: maybe, YEAR.
 *
 * Usage:
 *   STRAPI_URL=http://localhost:1337 STRAPI_API_TOKEN=xxx node import-all.mjs
 *
 * Requires Node 18+ (built-in fetch).
 *
 * Writes the original bracketed code (e.g. "J23", "C102", "B15") directly
 * into the `referenceCode` field for every entry — this sidesteps the
 * auto-numbering logic in the frontend entirely, since these source lists
 * already carry the authoritative numbering.
 */

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

if (!STRAPI_API_TOKEN) {
  console.error('Missing STRAPI_API_TOKEN env var. Generate one in Strapi admin: Settings -> API Tokens (Full access or Custom with create permission on Publication).');
  process.exit(1);
}

// --- Paste each section's raw text here ---

const JOURNALS_TEXT = `
[J23] "The Predictive Capabilities of Artificial Intelligence-Based OCT Analysis for Age-Related Macular Degeneration Progression—A Systematic Review", Muntean, G.A.; Marginean, A.; Groza, A.; Damian, I.; Roman, S.A.; Hapca, M.C.; Muntean, M.V.; Nicoară, S.D, Diagnostics Vol. 13, Iss. 14, DOI: 10.3390/diagnostics13142464, 2023.
[J22] "The profile: unleashing your deepfake self", Cheres, Ioana and Groza, Adrian, Multimedia Tools and Applications Springer Nature, pp. InPress, DOI: https://doi.org/10.1007/s11042-023-14568-x, 2023.
[J21] "Artificial Intelligence for Personalised Ophthalmology Residency Training", Muntean, George Adrian and Groza, Adrian and Marginean, Anca and Slavescu, Radu Razvan and Steiu, Mihnea Gabriel and Muntean, Valentin and Nicoara, Simona Delia, Journal of Clinical Medicine Vol. 12, Iss. 5, DOI: 10.3390/jcm12051825, 2023.
[J20] "Predicting Visual Acuity in Patients Treated for AMD", Marginean, Beatrice-Andreea and Groza, Adrian and Muntean, George and Nicoara, Simona Delia, Diagnostics MDPI, Vol. 12, Iss. 6, pp. 1504, 2022.
[J19] "Cat de inteligent este Artificial Intelligence Act?", Silvia Uscov and Adrian Groza, Curierul judiciar (Inteligenta Artificiala), C.H. Beck, Vol. 2, pp. 70-83, 2022.
[J18] "Interleaving Automatic Segmentation and Expert Opinion for Retinal Conditions", Bilc, Sergiu and Groza, Adrian and Muntean, George and Nicoara, Simona Delia, Diagnostics MDPI, Vol. 12, Iss. 1, pp. 22, DOI: 10.3390/diagnostics12010022, 2021.
[J17] "Agents that argue and explain classifications of retinal conditions", Groza, Adrian and Toderean, Liana and Muntean, George Adrian and Nicoara, Simona Delia, Journal of Medical and Biological Engineering Springer, Vol. 41, Iss. 5, pp. 730--741, DOI: 10.1007/s40846-021-00647-7, 2021.
[J16] "Natural language understanding for logical games", Adrian Groza and Cristian Nitu, CoRR Vol. abs/2110.00558, 2021.
[J15] "Reliable Learning with PDE-Based CNNs and DenseNets for Detecting COVID-19, Pneumonia, and Tuberculosis from Chest X-Ray Images", Marginean, Anca Nicoleta and Muntean, Delia Doris and Muntean, George Adrian and Priscu, Adelina and Groza, Adrian and Slavescu, Radu Razvan and Timbus, Calin Lucian and Munteanu, Gabriel Zeno and Morosanu, Cezar Octavian and Cosnarovici, Maria Margareta and Pintea, Camelia-M., Mathematics Vol. 9, Iss. 4, DOI: 10.3390/math9040434, 2021.
[J14] "FastRCA-Seq: An efficient approach for extracting hierarchies of multilevel closed partially-ordered patterns", Cristina Nica, Victor-Petru Almăşan, Adrian Groza, Knowledge-Based Systems Vol. 210, pp. 106533, DOI: https://doi.org/10.1016/j.knosys.2020.106533, 2020.
[J13] "Detecting fake news for the new coronavirus by reasoning on the Covid-19 ontology", Adrian Groza, CoRR Vol. abs/2004.12330, 2020.
[J12] "Climate change opinions in online debate sites", Groza, Adrian and Ozturk, Pinar and Razvan-Slavescu, Radu and Marginean, Anca, Computer Science and Information Systems Iss. 1, pp. 93--116, DOI: 10.2298/CSIS180601015, 2020.
[J11] "Improving conflict resolution in version spaces for precision agriculture", Groza, Adrian and Ungur, Iulia, International Journal of Agricultural Science International Association of Research and Science, Vol. 3, pp. 26--33, 2018.
[J10] "Improving remote sensing crop classification by argumentation-based conflict resolution in ensemble learning", Ştefan Conţiu and Adrian Groza, Expert Systems with Applications (ESWA), Vol. 64, pp. 269 - 286, DOI: 10.1016/j.eswa.2016.07.037, 2016.
[J9] "Assuring safety in air traffic control systems with argumentation and model checking", Sergio Alejandro Gómez and Anca Goron and Adrian Groza and Ioan Alfred Letia, Expert Systems with Applications (ESWA), Vol. 44, pp. 367 - 385, DOI: http://dx.doi.org/10.1016/j.eswa.2015.09.027, 2016.
[J8] "Compliance checking of integrated business processes", Ioan Alfred Letia and Adrian Groza, Data \\& Knowledge Engineering Vol. 87, Iss. 0, pp. 1 - 18, DOI: http://dx.doi.org/10.1016/j.datak.2013.03.002, 2013.
[J7] "Plausible Description Logic Programs for Stream Reasoning", Groza, Adrian and Letia, Ioan Alfred, Future Internet Vol. 4, Iss. 4, pp. 865--881, DOI: 10.3390/fi4040865, 2012.
[J6] "Ontology Enrichment and Evaluation Using OntoRich", A. Groza, G. Barbur, B. Bogdan, Automation Computers Applied Mathematics UTPress, Vol. 20, pp. 81-88, 2011.
[J5] "Ontology enrichment using semantic wikis and design patterns", Georgiu, M. and Groza, A., Studia Universitas Babes Bolyai Vol. LVI, Iss. 2, pp. 31--36, 2011.
[J4] "Enacting Social Argumentative Machines in Semantic Wikipedia", Groza, Adrian and Indrie Sergiu, Ubiquitous Computing and Communication Journal Vol. 6, pp. 672-680, 2011.
[J3] "Agent-based Systems for Norm Compliance in Food Supply Chains", Groza, A. and Letia, I.A., Analele Universitatii de Vest din Timisoara Vol. 48, Iss. 3, 2010.
[J2] "Modelling Imprecise Arguments in Description Logic", Letia, Ioan Alfred and Groza, Adrian, Advances in Electrical and Computer Engineering Vol. 9, Iss. 3, pp. 94-99, 2009.
[J1] "Finding agent similarities in supply chain formation", I. A. Letia, A. Groza, Advances in Electrical and Computer Engineering (AECE), Stefan cel Mare University of Suceava, Vol. 4, Iss. 1, pp. 20-26, DOI: 10.4316/AECE, 2004.
`;

const CONFERENCES_TEXT = `
[C102] "Artificial Intelligence in Teaching and Learning For Student-Centered Education", Aurelian Ionescu and Luciana Morogan and Adrian Groza, (FOHE-BPRC5), Bucuresti, Romania Springer, , DOI: , 2024.
[C101] "First Order Logic for command understanding", Groza Adrian, (ICARA 2024), Athens, Greece IEEE, , DOI: , 2024.
[C100] "Measuring reasoning capabilities of ChatGPT", Groza Adrian, (), , , DOI: , 2023.
[C99] "Cross-validation of Answers with SUMO and GPT", Lupu, Dan and Groza Adrian and Adam Pease, Knowledge Base Construction from Pre-Trained Language Models (KBC-LM@ 22nd International Semantic Web Conference (ISWC 2023)), Athens, Greece COEU, , DOI: , 2023.
[C98] "Forest Mixing: investigating the impact of multiple search trees and a shared refinements pool on ontology learning", Marco Pop-Mihali and Adrian Groza, 10th International Conference on Artificial Intelligence \\& Applications (ARIA '23), Vienna, Austria AIRCC, , DOI: , 2023.
[C97] "Interleaving GANs with knowledge graphs to support design creativity for book covers", Motogna, Alexandru and Groza Adrian, (), , , DOI: , 2023.
[C96] "Solving probability puzzles with logic toolkit", Groza Adrian, (), , , DOI: , 2023.
[C95] "Case Study: Using AI-Assisted Code Generation In Mobile Teams", Vasiliniuc, Mircea Serban and Groza, Adrian, (ICCP23), Cluj-Napoca, Romania UTPress, , DOI: , 2023.
[C94] "Brave new world: AI in teaching and learning", Groza, Adrian and Marginean, Anca, 16th annual International Conference of Education, Research and Innovation (ICERI23), Seville, Spain , , DOI: , 2023.
[C93] "Ontology engineering with Large Language Models", Mateiu, Patricia and Groza, Adrian, 25th International Symposium on Symbolic and Numeric Algorithms for Scientific Computing (SYNASC23), Nancy, France , , DOI: , 2023.
[C92] "Formalising Natural Language Quantifiers for Human-Robot Interactions", Morar, Stefan and Groza, Adrian and Pomarlan, Mihai, 9th International Workshop on Artificial Intelligence and Cognition (AIC23), Bremen, Germany , , DOI: , 2023.
[C91] "Detecting diabetic retinopathy through fundus images using an ensemble of classifiers", Popescu, Eugen and Groza, Adrian and Damian Ioana, 11th International Conference on Advanced Technologies (ICAT23), Istanbul, Turkey , , DOI: , 2023.
[C90] "Teaching first order logic with friendly puzzles", Groza, Adrian, The 4th International Conference on Artificial Intelligence in Education Technology (AIET2023), Berlin, Germany Springer, , DOI: , 2023. [ Best presentation in its session at AIET2023! ]
[C89] "Age-Related Macular Degeneration Biomarker Segmentation from OCT images", Brehar, Raluca and Groza, Adrian and Damian, Ioana and Muntean, George and Nicoara, Simona Delia, 24th International Conference on Control Systems and Computer Science (CSCS23), IEEE, pp. 444--451, 2023.
[C88] "An ontology for Age-Related Macular Degeneration using ophthalmologists and language models", Groza, Adrian, Anca Marginean and Simona Delia Nicoara, 14th Int. Conf. on Semantic Web Applications and Tools for Heath Care and Life Sciences (SWAT4LS,23), Basel, Switzerland, February 13-16 2023.
[C87] "Evaluation Metrics in Explainable Artificial Intelligence (XAI)", Coroama, Loredana and Groza, Adrian, Advanced Research in Technologies, Information, Innovation and Sustainability (ARTIIS '22), Springer Nature Switzerland, pp. 401--413, Cham, DOI: 10.1007/978-3-031-20319-0_30, ISBN: 978-3-031-20319-0, 2022.
[C86] "Modeling and Simulation with Ontology Streams for Agents Interactions", Ioan Alfred Letia and Adrian Groza, 6th Workshop on Complexity in Engineering (ESM22), Porto, Portugal, September 26-28 2022.
[C85] "Detecting fake news using machine learning and reasoning in Description Logic", Adrian Groza, 6th Workshop on Complexity in Engineering (COMPENG22), Florence, Italy, July 18-20 pp. 1-4, DOI: 10.1109/COMPENG50184.2022.9905431, ISBN: 978-1-7281-7124-1, 2022.
[C84] "FACE: Fact Checker with Explanations", Adrian Groza, Aron Katona, 24th International Symposium on Symbolic and Numeric Algorithms for Scientific Computing (SYNASC22), Linz, Austria, 12-15 September DOI: , 2022.
[C83] "Detecting clickbaits using deep forest", Vlad Cofaru and Adrian Groza, IEEE 18th International Conference on Intelligent Computer Communication and Processing (ICCP '22), DOI: , 2022.
[C82] "Ensemble-based Knowledge Distillation for Semantic Segmentation in Autonomous Driving", Iulia Dragan and Adrian Groza, IEEE 18th International Conference on Intelligent Computer Communication and Processing (ICCP '22), DOI: , 2022.
[C81] "Generating and solving the Lights Out! game in first order logic", Borbála Fazakas, Beáta Keresztes, Adrian Groza, IEEE 18th International Conference on Intelligent Computer Communication and Processing (ICCP '22), DOI: , 2022.
[C80] "Question Answering over Logic Puzzles Using Theorem Proving", Groza, Adrian and Nitu, Cristian, Proceedings of the 37th ACM/SIGAPP Symposium on Applied Computing (SAC '22), Virtual Event Association for Computing Machinery, pp. 871–874, New York, NY, USA, DOI: 10.1145/3477314.3507177, ISBN: 9781450387132, 2022.
[C79] "Learning ontologies with relational concept analysis", Mateiu Patricia, Groza Adrian, Nica Cristina, 2022 IEEE 20th Jubilee World Symposium on Applied Machine Intelligence and Informatics (SAMI '22), Poprad, Slovakia 26 May 2022 pp. 219-224, DOI: 10.1109/SAMI54271.2022.9780837, ISBN: 978-1-6654-9704-6, 2022.
[C78] "Logic-based machine comprehension for chatbots", Redeca, Sergiu and Groza, Adrian, 2022 IEEE 20th Jubilee World Symposium on Applied Machine Intelligence and Informatics (SAMI '22), Poprad, Slovakia 26 May 2022 pp. 237-242, DOI: 10.1109/SAMI54271.2022.9780758, ISBN: 978-1-6654-9704-6, 2022.
[C77] "A Puzzle-Based Dataset for Natural Language Inference", Szomiu, Roxana and Groza, Adrian, 16ht Int. Conf. on Linguistic Resources and Tools for Natural Language Processing (ConsILR '21), 2021.
[C76] "Explainable Artificial Intelligence for Person Identification", Coroama, Loredana and Groza, Adrian, 2021 IEEE 17th International Conference on Intelligent Computer Communication and Processing (ICCP '21), pp. 375-382, DOI: 10.1109/ICCP53602.2021.9733525, 2021.
[C75] "Agents that argue and explain classifications of retinal conditions", A. Groza; L. Toderean; G. Muntean; S. D. Nicoara, International Conference on Advancements of Medicine and Health Care through Technology (IFMBE '20), Cluj-Napoca, Romania 2020. [ Best of MEDITECH 2020! ]
[C74] "MineFOL: a Game for Learning First Order Logic", Groza, Adrian and Baltatescu, Monalisa and M., Pomarlan, Mihai, IEEE 16th International Conference on Intelligent Computer Communication and Processing (ICCP '20), Cluj-Napoca, Romania pp. 153-160, DOI: 10.1109/ICCP51029.2020.9266174, ISBN: 978-1-7281-9080-8, 2020.
[C73] "Fake news detector in the medical domain by reasoning with description logics", Adrian Groza; Ana-Diana Pop, IEEE 16th International Conference on Intelligent Computer Communication and Processing (ICCP '20), Cluj-Napoca, Romania pp. 145-152, DOI: 10.1109/ICCP51029.2020.9266270, ISBN: 978-1-7281-9080-8, 2020.
[C72] "On the differences between human agents and logic-based software agents discourse understanding", Groza, Adrian, Mining Intelligence and Knowledge Exploration (LNCS), Goa, India Springer, Vol. 11987, pp. 1-10, DOI: 10.1007/978-3-030-66187-8_1, ISBN: 978-3-030-66186-1, 2020.
[C71] "Towards Balancing the Complexity of Convolutional Neural Network with the Role of Optical Coherence Tomography in Retinal Conditions", Marginean, Anca and Groza, Adrian and Nicoara, Simona Delia and Muntean, George and Slavescu, Radu Razvan and Letia, Ioan Alfred, IEEE 15th International Conference on Intelligent Computer Communication and Processing (ICCP '19), Cluj-Napoca, Romania pp. 475--482, DOI: 10.1109/ICCP48234.2019.8959714, ISBN: 978-1-7281-4914-1, 2019.
[C70] "A mentalist agent for identifying characters using dynamic query strategies", Groza, Adrian and Coroama, Loredana, IEEE 15th International Conference on Intelligent Computer Communication and Processing (ICCP '19), Cluj-Napoca, Romania pp. 319--326, DOI: 10.1109/ICCP48234.2019.8959717, ISBN: 978-1-7281-4914-1, 2019.
[C69] "The impact of summarisation on textual entailment-a case study on global warming arguments", Groza, Adrian and Popa, Oana Maria, 10th International Conference on Electronics, Computers and Artificial Intelligence (ECAI '18), Iasi, Romania pp. 1--6, DOI: 10.1109/ECAI.2018.8679022, ISBN: 978-1-5386-4901-5, 2018.
[C68] "Analysing climate change arguments using subjective logic", Groza, Adrian and Ozturk, Pinar and Slavescu, Radu Razvan and Marginean, Anca and Prasath, Rajendra, 2018 IEEE 14th International Conference on Intelligent Computer Communication and Processing (ICCP '17), Cluj-Napoca, Romania pp. 37--44, DOI: 10.1109/ICCP.2018.8516616, ISBN: 978-1-5386-8445-0, 2018.
[C67] "Designing agents for the Stratego game", Redeca, Sergiu and Groza, Adrian, 2018 IEEE 14th International Conference on Intelligent Computer Communication and Processing (ICCP '17), Cluj-Napoca, Romania pp. 97--104, DOI: 10.1109/ICCP.2018.8516593, ISBN: 978-1-5386-8445-0, 2018.
[C66] "Climebot: An argumentative agent for climate change", Toniuc, Daniel and Groza, Adrian, 13th IEEE International Conference on Intelligent Computer Communication and Processing (ICCP '17), Cluj-Napoca, Romania pp. 63--70, DOI: 10.1109/ICCP.2017.8116984, ISBN: 978-1-5386-3368-7, 2017.
[C65] "Analysing debates on climate change with textual entailment and ontologies", Szabo, Roxana and Groza, Adrian, 13th IEEE International Conference on Intelligent Computer Communication and Processing (ICCP '17), Cluj-Napoca, Romania pp. 39--46, DOI: 10.1109/ICCP.2017.8116981, ISBN: 978-1-5386-3368-7, 2017.
[C64] "Harmonization of conflicting medical opinions using argumentation protocols and textual entailment-a case study on Parkinson disease", Groza, Adrian and Nagy, Madalina Mandy, IEEE 12th International Conference on Intelligent Computer Communication and Processing (ICCP '16), Cluj-Napoca, Romania pp. 163--170, DOI: 10.1109/ICCP.2016.7737140, ISBN: 978-1-5090-3899-2, 2016.
[C63] "Mining arguments from cancer documents using Natural Language Processing and ontologies", Groza, Adrian and Popa, Oana Maria, IEEE 12th International Conference on Intelligent Computer Communication and Processing (ICCP '16), Cluj-Napoca, Romania pp. 77--84, DOI: 10.1109/ICCP.2016.7737126, ISBN: 978-1-5090-3899-2, 2016.
[C62] "Assisting drivers during overtaking using Car-2-Car communication and multi-agent systems", Cara, Calin and Groza, Adrian and Zaporojan, Sergiu and Calmicov, Igor, IEEE 12th International Conference on Intelligent Computer Communication and Processing (ICCP '16), Cluj-Napoca, Romania pp. 293--299, DOI: 10.1109/ICCP.2016.7737162, ISBN: 978-1-5090-3899-2, 2016.
[C61] "Enacting textual entailment and ontologies for automated essay grading in chemical domain", Groza, Adrian and Roxana, Szabo, 16th Int. Symposium on Computational Intelligence and Informatics (CINTI '15), Budapest, Hungary, 19-21 November pp. 221-226, DOI: 10.1109/CINTI.2015.7382926, ISBN: 978-1-4673-8520-6, 2015.
[C60] "Data structuring for the ontological modelling of wind energy systems", Groza, Adrian, 4th Int. Conf. on Modelling and Development of Intelligent Systems (MDIS '15), Sibiu, Romania, 28 Oct. 1 Nov. 2015 pp. 52--58, 2015.
[C59] "Information retrieval in folktales using natural language processing", Groza, Adrian and Corde, Lidia, 2015 IEEE International Conference on Intelligent Computer Communication and Processing (ICCP '15), Cluj-Napoca, Romania pp. 59--66, DOI: 10.1109/ICCP.2015.7312606, ISBN: 978-1-4673-8200-7, 2015.
[C58] "ProGraph: towards enacting bipartite graphs for abstract argumentation frameworks", Serban Groza and Adrian Groza, International Competition on Computational Models of Argumentation (ICCMA '15), 2015.
[C57] "Simulation and Control of the Vehicles Movement in the Case of the Overtaking Procedures", Muresan, Vlad and Groza, Adrian and Iancu, Bogdan and Clitan, Iulia, Applied Mechanics and Materials (ICMERA '14), Vol. 656, pp. 423--431, 2014.
[C56] "Engineering a Comprehensive Romanian Tourism Ontology", A. Groza, R. Slavescu, I. Dragoste, B. Varga, 2nd Workshop on Intelligent Systems: concepts, models, services and applications at ICMCS2014 (ICMCS '14), Chisinau, Republic of Moldova, 22-25 October 2014 2014.
[C55] "Generating training sets for conditional random fields with morphological labels for Romanian", R. Slavescu, A. Groza, M., I. Barbantan, 2nd Workshop on Intelligent Systems: concepts, models, services and applications at ICMCS2014 (ICMCS '14), Chisinau, Republic of Moldova, 22-25 October 2014 2014.
[C54] "LELA - A natural language processing system for Romanian tourism", Bernadette Varga and Alina Dia Trambitas-Miron and Andrei Roth and Anca Marginean and Radu Razvan Slavescu and Adrian Groza, Proceedings of the 2014 Federated Conference on Computer Science and Information Systems (Annals of Computer Science and Information Systems), IEEE, Vol. 2, pp. 281--288, DOI: 10.15439/2014F323, 2014. [ Best of FedCSIS 2014! ]
[C53] "Assuring safety in an air traffic control system with defeasible logic programming", Gómez, Sergio Alejandro and Goron, Anca and Groza, Adrian, XLIII Jornadas Argentinas de Informática e Investigación Operativa (43JAIIO)-XV Argentine Symposium on Artificial Intelligence (ASAI)(Buenos Aires, 2014) pp. 18-25, 2014.
[C52] "An Ontology Selection and Ranking System Based on the Analytic Hierarchy Process", Groza, A. and Dragoste, I. and Sincai, I. and Jimborean, I. and Moraru, V., 16th International Symposium on Symbolic and Numeric Algorithms for Scientific Computing (SYNASC '14), pp. 293-300, DOI: 10.1109/SYNASC.2014.47, 2014.
[C51] "Consistency Checking of Safety Arguments in the Goal Structuring Notation Standard", Adrian Groza and Nicoleta Marc, IEEE 10th International Conference on Intelligent Computer Communication and Processing (ICCP,14), Cluj-Napoca, Romania, 4-6 September 2014 pp. 59-66, 2014.
[C50] "Ranking Ontologies in the Ontology Building Competition BOC 2014", Ioana Jimborean and Adrian Groza, IEEE 10th International Conference on Intelligent Computer Communication and Processing (ICCP,14), Cluj-Napoca, Romania, 4-6 September 2014 pp. 75-82, 2014.
[C49] "Interleaving Ontology-Based Reasoning and Natural Language Processing for Character Identification in Folktales", Daniel Suciu and Adrian Groza, IEEE 10th International Conference on Intelligent Computer Communication and Processing (ICCP,14), Cluj-Napoca, Romania, 4-6 September 2014 pp. 67-74, 2014.
[C48] "Numerical simulation and automatic control of the pH value in an industrial blunting system", Muresan, Vlad and Groza, Adrian and Abrudean, Mihail and Colosi, Tiberiu, Informatics in Control, Automation and Robotics, 2014 11th International Conference on (ICINCO '14), 1-3 September, Vienna, Austria Vol. 01, pp. 540-549, 2014.
[C47] "An ontology-based model for vehicular ad-hoc networks", Groza, A. and Marginean, A. and Muresan, V., Intelligent Engineering Systems 2014 18th International Conference on (INES,14), Tihani, Hungary pp. 83-88, DOI: 10.1109/INES.2014.6909346, 2014.
[C46] "Romanian2SPARQL: A Grammatical Framework approach for querying Linked Data in Romanian", Marginean, A and Groza, A and Slavescu, R.R. and Letia, IA, Development and Application Systems, 2014 International Conference on (DAS '14), pp. 204-209, DOI: 10.1109/DAAS.2014.6842456, ISBN: 978-1-4799-5092-8, 2014.
[C45] "A second order-cone programming relaxation for facility location problem", Vasile Moraru and Sergiu Zaporojan. and Adrian Groza, Development and Application Systems, 2014 International Conference on (DAS '14), Suceava, Romania, May 15-17, 2014 pp. 189-191, DOI: 10.1109/DAAS.2014.6842453, ISBN: 978-1-4799-5092-8, 2014.
[C44] "A multi-agent approach towards cooperative overtaking in vehicular networks", Adrian Groza and Iancu and Anca Nicoleta Marginean, 4th International Conference on Web Intelligence, Mining and Semantics (WIMS 14), WIMS '14, Thessaloniki, Greece, June 2-4 2014 ACM, pp. 48:1--48:6, DOI: 10.1145/2611040.2611096, 2014.
[C43] "An Argumentative Approach to Assessing Safety in Medical Device Software Using Defeasible Logic Programming", Gómez, S.A. and Groza, A. and Chesñevar, C.I., International Conference on Advancements of Medicine and Health Care through Technology (IFMBE '14), Cluj-Napoca, Romania, 5--7 June 2014 Springer International Publishing, Vol. 44, pp. 167-172, DOI: 10.1007/978-3-319-07653-9_34, ISBN: 978-3-319-07652-2, 2014.
[C42] "ARGSAFE: Usando Argumentacion para Garantizar Seguridad en Sistemas Tecnicos Complejos", S. Gomez and A. Groza and C. Chesnevar and I. A. Letia and A. Goron and M Lucero, XVI Workshop de Investigadores en Ciencias dela Computation (WICC '14), Ushuaia, Tierra del Fuego, Argentina, 7-8 May 2014 2014.
[C41] "A learning environment for building and evaluating ontologies: case study of 2013 Ontology Building Competition", A. Groza and B. Varga and M. Vacca, 10th International Scientific Conference E-learning and Software in Education (ELSE '14), Bucuresti, Romania 'Carol I' National Defence University Publishing House, pp. 157-166, 2014.
[C40] "Towards an argumentative approach for repair of hybrid logics models", A. Goron and A. Groza and S. A. Gomez and I. A. Letia, Argumentation in Multi-Agent Systems (Argmas '14), Paris, France, 5-9 May 2014.
[C39] "Detecting influenza epidemics based on real-time semantic analysis of Twitter streams", Radu Balaj and Adrian Groza, Modelling and Development of Intelligent System (MDIS '13), Sibiu, Romania, 10-12 October 2013 Lucian Blaga University Press, pp. 30-39, 2013.
[C38] "Semantic-Based Monitoring of E-Contracts", Visinari Gabriela and Adrian Groza, 10th National Conference on Human - Computer Interaction (ROCHI '13), pp. 161-164, 2013.
[C37] "ASDEC: Structured Argumentation for Decision Support Systems Under Normative Constraints", Adrian Groza and Sergiu Zaporojan, 1st Workshop on Flexible Communication Between Human and Software Agents (ASDEC '13), Cluj-Napoca, Romania, 4 September 2013 2013.
[C36] "Reasoning on Semantic Sensor Streams for Smart City", Oxana Hotea and Adrian Groza, International Conference on Intelligent Information Systems Chisinau, Republic of Moldova, August 20-23 pp. 219-222, ISBN: 978-9975-4237-1-7, 2013.
[C35] "Interleaved Argumentation and Explanation in Dialogue", Letia, I.A. and Groza, A., 12th Workshop on Computational Models of Natural Argument CMNA@ECAI (CMNA '12), Montpellier, France pp. to appear, 2012.
[C34] "Justifying Argument and Explanation in Labelled Argumentation", Letia, Ioan Alfred and Groza, Adrian, Intelligent Computer Communication and Processing, 2012 IEEE International Conference on (ICCP '12), pp. 11-18, Cluj-Napoca Romania, DOI: 10.1109/ICCP.2012.6356154, ISBN: 978-1-4673-2952-1, 2012.
[C33] "Integrated Framework for Multi-Agent Ontology Engineering", Groza Adrian, PostDoc Forum for the Excel Project pp. 99-106, 2012.
[C32] "Justificatory Argumentation for Commitment Agents", Letia, I. and Groza, A., Argumentation in Multi-Agent Systems (Argmas '12), Valencia, Spain, 2012.
[C31] "Description Plausible Logic Programs for Stream Reasoning", Ioan Alfred Letia and Adrian Groza, ICAART 2012 - Proceedings of the 4th International Conference on Agents and Artificial Intelligence Volume 1 - Artificial Intelligence SciTePress, pp. 560-566, Vilamoura, Algarve, Portugal, ISBN: 978-989-8425-95-9, 2012.
[C30] "Building an E-contract management system using Google Docs", Visinari, G. and Groza, A., Computational Intelligence and Informatics, 2011 IEEE 12th International Symposium on (CINTI '11), pp. 225--230, DOI: 10.1109/CINTI.2011.6108503, ISBN: 978-1-4577-0045-3, 2011.
[C29] "Argumentation Based Ontology Maintenance", Groza Adrian and Mechno Raluca, 2nd International Conference on Modelling and Development of Intelligent Systems (MDIS '11), pp. 58-67, Sibiu, Romania, 2011.
[C28] "Argumentative Agents for Justifying Decisions in Audit", I.A. Letia, A. Groza, R. Balaj, Intelligent Computer Communication and Processing (ICCP), 2011 IEEE International Conference on (ICCP '11), pp. 71-78, DOI: 10.1109/ICCP.2011.6047846, ISBN: 978-1-4577-1481-8, 2011.
[C27] "Integrating DBpedia and SentiWordNet for a tourism recommender system", Varga, B. and Groza, A., Intelligent Computer Communication and Processing (ICCP), 2011 IEEE International Conference on (ICCP '11), pp. 133--136, DOI: 10.1109/ICCP.2011.6047856, ISBN: 978-1-4577-1481-8, 2011.
[C26] "OntoRich-A support tool for semi-automatic ontology enrichment and evaluation", Barbur, G. and Blaga, B. and Groza, A., Intelligent Computer Communication and Processing, 2011 IEEE International Conference on (ICCP '11), pp. 129--132, ISBN: 978-1-4577-1481-8, 2011.
[C25] "Arguing with Justifications Between Collaborating Agents", Letia, I.A. and Groza, A., Seventh International Workshop on Argumentation in Multi-Agent Systems (ArgMAS '11), pp. 44, 2011.
[C24] "Towards automatic norm compliance in construction domain", Groza, Adrian and Man, Camelia, Applied Machine Intelligence and Informatics, 2011 IEEE 9th International Symposium on (SAMI '11), pp. 83--87, Smolenice, Slovakia, DOI: 10.1109/SAMI.2011.5738853, ISBN: 978-1-4244-7430-1, 2011.
[C23] "Developing Hazard Ontology for Supporting HACCP Systems in Food Supply Chains", Letia, Ioan Alfred and Groza, Adrian, 8th IEEE International Symposium on Intelligent Systems and Informatics (SISY '10), pp. 57-62, Subotica, Serbia, DOI: 10.1109/SISY.2010.5647189, ISBN: 978-1-4244-7396-0, 2010.
[C22] "Using Semantic Wikis for Structured Argument in Medical Domain", Groza, Adrian and Balaj, Radu, Workshop on Semantic Web Applications and Tools for Life Sciences (SWAT4LS), Vol. 698, Berlin, Germany, 2010.
[C21] "Aiming to Agent-based Systems for Norm Compliance in Food Supply Chains", Groza, Adrian and Letia, Ioan Alfred, 7th Workshop on Agents for Complex Systems Timisoara, Romania, 2010.
[C20] "Towards Social Argumentative Machines", Indrie, Sergiu and Groza, Adrian, 6th International Conference on Intelligent Computer Communication and Processing pp. 99-102, Cluj-Napoca, Romania, DOI: 10.1109/ICCP.2010.5606456, ISBN: 978-1-4244-8230-6, 2010.
[C19] "Mining Traffic Patterns from Public Transportation GPS Data", Lipan, Florin and Groza, Adrian, 6th International Conference on Intelligent Computer Communication and Processing (ICCC '10), pp. 123-126, Cluj-Napoca, Romania, DOI: 10.1109/ICCP.2010.5606450, ISBN: 978-1-4244-8230-6, 2010.
[C18] "Enacting Argumentative Web in Semantic Wikipedia", Indrie, Sergiu and Groza, Adrian, 9th RoEduNet International Conference pp. 163-168, Sibiu, Romania, ISBN: 978-9-7373-9951-9, 2010.
[C17] "Argumentative Support for Structured HACCP Plans", Letia, Ioan Alfred and Groza, Adrian, International Conference on Development and Application Systems pp. 345-350, Suceava, Romania, 2010.
[C16] "Towards Pragmatic Argumentative Agents Within a Fuzzy Description Logic Framework", Letia, Ioan Alfred and Groza, Adrian, Seventh International Workshop on Argumentation in Multi-Agent Systems (ArgMAS '10), Toronto, Canada, 2010.
[C15] "Modelling Imprecise Arguments in a Weighted Argument System", Groza, Adrian, 5th International Conference on Intelligent Computer Communication and Processing pp. 43-46, Cluj-Napoca, Romania, DOI: 10.1109/ICCP.2009.5284786, ISBN: 978-1-4244-5007-7, 2009.
[C14] "Q-learn Argumentation Schemes for Car Sales Dialogues", Groza, Adrian, 4rd IEEE International Conference on Intelligent Computer Communication and Processing (ICCP '06), pp. 257-260, Cluj-Napoca, Romania, DOI: 10.1109/ICCP.2008.4648381, ISBN: 978-1-4244-2673-7, 2008.
[C13] "Contextual extension with Concept Maps in the Argument Interchange Format Ontology", Letia, Ioan Alfred and Groza, Adrian, Fifth International Workshop on Argumentation in Multi-Agent Systems (ArgMAS 2008) Estoril, Portugal, 2008.
[C12] "Designing Electronic Markets for Defeasible-based Contractual Agents", Adrian Groza, European Summer School in Logic, Language, and Information, First Workshop on Logics For Agents and Mobility (ESSLLI '08), pp. 27-42, Hamburg, Germany, 2008.
[C11] "A Computational Model for World Wide Argument Web", Adrian Groza, 13th Estonian Winter School in Computer Science (EWSC '08), Palmse, Estonia, 2008.
[C10] "Towards Mediation with Extended Temporal Defeasible Logic", Adrian Groza, Advanced Course on Artificial Intelligence Summer School (ACAI '07), Leuven, Belgium, 2007.
[C9] "Structured Argumentation in a Mediator for Online Dispute Resolution", Letia, Ioan Alfred and Groza, Adrian, Declarative Agent Languages and Technologie (DALT '07), Honolulu, SUA, 2007.
[C8] "An Argumentative System for Online Dispute Resolution", Letia, Ioan Alfred and Groza, Adrian, The 16 International Conference on Control Systems and Computer Science Editura Politehnica, pp. 2--9, Bucuresti, Romania, ISBN: 9789737187413, 2007.
[C7] "Specification-based agents for service composition", Letia, Ioan Alfred, A. Chioran, Groza, Adrian, Workshop on Service-Oriented Computing and Agent-Based Engineering (SOCABE '05), Utrecht, The Nethrlands pp. 17-24, 2005.
[C6] "Planning with Argumentation Schemes in Online Dispute Resolution", Letia, Ioan Alfred and Groza, Adrian, 3rd IEEE International Conference on Intelligent Computer Communication and Processing (ICCP '06), pp. 1-10, Cluj-Napoca, Romania, DOI: 10.1109/ICCP.2007.4352137, ISBN: 978-1-4244-1491-8, 2007.
[C5] "Defeasible Commitments for Contract Representation", Letia, Ioan Alfred and Groza, Adrian, 2nd IEEE International Conference on Intelligent Computer Communication and Processing (ICCP '06), pp. 45--52, Cluj-Napoca, Romania, 2006.
[C4] "Exceptions in Contract in Defeasible Logic", Letia, Ioan Alfred and Groza, Adrian, The 8th International Conference on Development and Application Systems pp. 374--381, Suceava, Romania, ISBN: 973-666-194-6, 2006.
[C3] "Automating the Dispute Resolution in a Task Dependency Network", Ioan Alfred Letia and Adrian Groza, Proceedings of the 2005 IEEE/WIC/ACM International Conference on Intelligent Agent Technology September 19-22 (IAT '05), IEEE Computer Society, pp. 365-371, Compiegne, France, DOI: 10.1109/IAT.2005.47, ISBN: 0-7695-2416-8, 2005.
[C2] "Automating the Dispute Resolution for B2B", Letia, Ioan Alfred and Groza, Adrian, The International Symposium on System Theory, Automation, Robotics, Computers, Informatics, Electronics and Instrumentation pp. 570-575, Craiova, Romania, 2005.
[C1] "Using Agent Similarities in Business Rules for the Supply Chain", Ioan Alfred Letia and Adrian Groza, The 8th IEEE International Conference on Intelligent Engineering Systems (INES '04), Cluj-Napoca, Romania pp. 68-72, DOI: , 2004.
`;

const BOOK_CHAPTERS_TEXT = `
[B15] "Towards Detecting Fake News Using Natural Language Understanding and Reasoning in Description Logics", Groza, Adrian, Measuring Ontologies for Value Enhancement: Aligning Computing Productivity with Human Creativity for Societal Adaptation Springer Nature Switzerland, pp. 57--72, Cham, DOI: https://doi.org/10.1007/978-3-031-22228-3_3, ISBN: 978-3-031-22228-3, 2023.
[B14] "Towards an Ontology of Explanations", Groza, Adrian and Pomarlan, Mihai, Measuring Ontologies for Value Enhancement: Aligning Computing Productivity with Human Creativity for Societal Adaptation Springer Nature Switzerland, pp. 73--85, Cham, DOI: https://doi.org/10.1007/978-3-031-22228-3_4, ISBN: 978-3-031-22228-3, 2023.
[B13] "Interleaved Argumentation and Explanation in Dialog", Groza, Adrian, Reasoning: Games, Cognition, Logic (Poznan Reasoning Week), College Publications, pp. 115-136, ISBN: 978-1-84890-325-8, 2020.
[B12] "A formal approach for identifying assurance deficits in unmanned aerial vehicle software", A. Groza, I. A. Letia, A. Goron and S. Zaporojan, In Proceedings of 23 International Conference on Systems Engineering (Advances in Intelligent Systems \\& Computing Series), Las Vegas, USA Springer International Publishing, Vol. 1089, pp. 233-239, DOI: 10.1007/978-3-319-08422-0_35, ISBN: 978-3-319-08422-0, 2015.
[B11] "An approach to schedule Production Using Reservation Tables", S. Zaporojan and V. Moraru and A. Groza, In Proceedings of 23 International Conference on Systems Engineering (Advances in Intelligent Systems \\& Computing Series), Las Vegas, USA Springer International Publishing, Vol. 1089, pp. 615-620, DOI: 0.1007/978-3-319-08422-0_87, ISBN: 978-3-319-08422-0, 2015.
[B10] "Towards Improving Situation Awareness during Emergency Transportation through Ambulance-2-X Communication and Semantic Stream Reasoning", Groza, A. and Marginean, A. and Iancu, B., International Conference on Advancements of Medicine and Health Care through Technology (IFMBE '14), Cluj-Napoca, Romania, 5--7 June 2014 Springer International Publishing, Vol. 44, pp. 97-100, DOI: 10.1007/978-3-319-07653-9_20, ISBN: 978-3-319-07652-2, 2014.
[B9] "Arguing With Justifications Between Collaborating Agents", Letia, Ioan Alfred and Groza, Adrian, Argumentation in Multi-Agent Systems (LNAI), Springer, Vol. 7543, pp. 102-116, DOI: 10.1007/978-3-642-33152-7_7, ISBN: 978-3-642-33152-7, 2012.
[B8] "Towards Pragmatic Argumentative Agents within a Fuzzy Description Logic Framework", Letia, I. and Groza, Adrian, Argumentation in Multi-Agent Systems, Revised Selected and Invited Papers (LNAI), Springer, Vol. 6614, pp. 209--227, DOI: 10.1007/978-3-642-21940-5_13, ISBN: 978-3-642-21940-5, 2011.
[B7] "A Planning-Based Approach for Enacting World Wide Argument Web", Ioan Alfred Letia and Adrian Groza, Intelligent Distributed Computing, Systems and Applications, of the 2nd International Symposium on Intelligent Distributed Computing - IDC 2008, Catania, Italy 2008 (Studies in Computational Intelligence), Springer, Vol. 162, pp. 137-146, DOI: 10.1007/978-3-540-85257-5_14, ISBN: 978-3-540-85256-8, 2008.
[B6] "Contextual Extension with Concept Maps in the Argument Interchange Format", Ioan Alfred Letia and Adrian Groza, Argumentation in Multi-Agent Systems, Fifth International ArgMAS 2008, Estoril, Portugal, May 12 2008. Revised Selected and Invited Papers (LNCS), Springer, Vol. 5384, pp. 72-89, DOI: 10.1007/978-3-642-00207-6, ISBN: 978-3-642-00206-9, 2009.
[B5] "Structured Argumentation in a Mediator for Online Dispute Resolution", Letia, Ioan Alfred and Groza, Adrian, Declarative Agent Languages and Technologies (DALT 2007) (LNAI), Springer, Vol. 4897, pp. 193-200, DOI: 10.1007/978-3-540-77564-5_12, ISBN: 978-3-540-77564-5, 2008.
[B4] "Exploiting Rough Argumentation in an Online Dispute Resolution Mediator", Ioan Alfred Letia and Groza, Adrian, Rough Sets and Intelligent Systems Paradigms, International Conference, RSEISP 2007, Warsaw, Poland, June 28-30, 2007 (LNCS), Springer, Vol. 4585, pp. 697-706, DOI: 10.1007/978-3-540-73451-2_73, ISBN: 978-3-540-73450-5, 2007.
[B3] "Z-Based Agents for Service Oriented Computing", Ioan Alfred Letia and Anca Marginean and Groza, Adrian, Service-Oriented Computing: Agents, Semantics, and Engineering, AAMAS 2007 International Workshop, SOCASE 2007, Honolulu, HI, USA, May 14, 2007, Proceedings (LNCS), Springer, Vol. 4504, pp. 160-174, DOI: 10.1007/978-3-540-72619-7_12, ISBN: 978-3-540-72618-0, 2007.
[B2] "Running Contracts with Defeasible Commitment", Advances in Applied Artificial Intelligence, 19th International on Industrial, Engineering and Other Applications Applied Intelligent Systems, IEA/AIE 2006, Annecy, France, June 27-30, 2006 Proceedings (Lecture Notes in Computer Science), Springer, Vol. 4031, pp. 91-100, DOI: 10.1007/11779568_12, ISBN: 3-540-35453-0, 2006.
[B1] "Agreeing on Defeasible Commitments", Letia, Ioan Alfred and Groza, Adrian, Declarative Agent Languages and Technologies IV, 4th International Workshop, DALT 2006, Hakodate, Japan, May 8, 2006, Selected Revised and Invited Papers (Lecture Notes in Computer Science), Springer, Vol. 4327, pp. 98-113, Hakodate, Japan, DOI: http://dx.doi.org/10.1007/11961536_11, ISBN: 3-540-68959-1, 2006.
`;

// Each section: which letter prefixes its codes in the source text, the raw
// text block, and the exact publicationType enum value to write in Strapi.
const SECTIONS = [
  { letter: 'J', rawText: JOURNALS_TEXT, publicationType: 'journal' },
  { letter: 'C', rawText: CONFERENCES_TEXT, publicationType: 'conference' },
  { letter: 'B', rawText: BOOK_CHAPTERS_TEXT, publicationType: 'bookChapter' },
];

// --- Parsing (shared by all three sections) ---

function parseEntries(raw, letter) {
  const pattern = new RegExp(`\\[${letter}(\\d+)\\]\\s*"([^"]+)"([\\s\\S]*?)(?=\\[${letter}\\d+\\]|$)`, 'g');
  const matches = [...raw.matchAll(pattern)];

  return matches.map((m) => {
    const [, num, title, rest] = m;
    const referenceCode = `${letter}${num}`;

    // DOI: capture whatever follows "DOI:" up to the next comma (may be empty).
    const doiMatch = rest.match(/DOI:\s*([^,]*),/);
    const doi = doiMatch && doiMatch[1].trim() ? doiMatch[1].trim() : null;

    // Year: the entry always ends with "..., YEAR." — take the LAST 4-digit
    // year-like number in the chunk, independent of where DOI/ISBN sit.
    const yearMatches = [...rest.matchAll(/\b(19|20)\d{2}\b/g)];
    const year = yearMatches.length ? parseInt(yearMatches[yearMatches.length - 1][0], 10) : null;

    const awarded = /\[\s*Best[^\]]*\]/i.test(rest);

    return {
      referenceCode,
      title: title.trim(),
      doi,
      year,
      awarded,
      raw: `"${title.trim()}"${rest.replace(/\[\s*Best[^\]]*\]/i, '').trim()}`,
    };
  });
}

function slugify(title) {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 80);
}

async function createPublication(entry, publicationType) {
  const payload = {
    data: {
      title: entry.title,
      slug: slugify(entry.title),
      fullCitation: entry.raw,
      publicationType,
      year: entry.year,
      doi: entry.doi ?? undefined,
      awarded: entry.awarded,
      referenceCode: entry.referenceCode,
    },
  };

  const res = await fetch(`${STRAPI_URL}/api/publications`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${STRAPI_API_TOKEN}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Failed (${res.status}) for "${entry.title}": ${errText}`);
  }

  return res.json();
}

async function main() {
  for (const section of SECTIONS) {
    const entries = parseEntries(section.rawText, section.letter);
    console.log(`\n=== ${section.publicationType} (${entries.length} entries) ===\n`);

    for (const entry of entries) {
      if (!entry.title) {
        console.warn('Skipping entry with no parsed title.');
        continue;
      }
      try {
        await createPublication(entry, section.publicationType);
        console.log(`✅ [${entry.referenceCode}] ${entry.title} (${entry.year ?? '??'})${entry.awarded ? ' 🏆' : ''}`);
      } catch (err) {
        console.error(`❌ [${entry.referenceCode}] ${err.message}`);
      }
    }
  }

  console.log('\nDone.');
}

main();
