angular.module('sbAdminApp',['ngCsvImport'])
.controller('salonList', function ($scope, $compile, $http, $timeout, $window, $log, $state,NgTableParams,$resource,$q) {
    $scope.ticketTypes = ["Meeting", "Phone Call", "Cold Visit", "Cold Calling"];
    $scope.reponses = ["Interested", "Non-Interested"];
    $scope.nextActions = ["Meeting Fixed", "Currently No but will let You know incase intrested in future", "Fix Evalution", "Fix meeting with senior", "Fix second meeting", "Follow after the renovation is done", "Follow up as she will update after speaking with her husband", "Follow up as she will update after speaking with her Partner", "Follow up call", "Get MOU Done", "Meeting Done", "Met with manager, now need to fix meeting owner", "Not as per our standards", "Not Interested", "Passed the details to support team", "Shut down / Sold"]
    $scope.popup1 = {
        open1: false
    };
    $scope.stat=[{id:'100% (closed)',title:'100% (closed)'},
    {id:'90% (In closing Process)',title:'90% (In closing Process)'},
    {id:'75% (Considering)',title:'75% (Considering)'},
    {id:'50% (May be later)',title:'50% (May be later)'},
    {id:'25% (Not Interested)',title:'25% (Not Interested)'},
    {id:'0% (Not Fit)',title:'0% (Not Fit)'}]
    $scope.getZonesValues=$q.defer();
    $scope.getAreasValues=$q.defer();
    $scope.areas=["Sahakar Nagar","Navi Peth","Bhor","Aambethan","Agarkar Nagar","Akurdi","Alandi","Alandi Road","Alephata","Ambarwet","Ambavane","Ambegaon Budruk","Ambegaon Khurd","Anand Nagar","Ashok Nagar","Ashtapur","Aundh","Aundh Road","Awhalwadi","Bahul","Bajirao Road","Bakori","Balaji Nagar","Balewadi","Baner","Baner Bypass Highway","Baner Pashan Link Road","Baramati","Bavdhan","Bhaginghar","Bhawani Peth","Bhekrai Nagar","Bhilarewadi","Bhoirwadi","Bhor","Bhosale Nagar","Bhosari","Bhugaon","Bhukum","Bhandarkar Road","Bhusari Colony","Bibwewadi","Boat Club Road","Bope","Bopgaon","Bopkhel","Bopodi","Boripardhi","BT Kawade Road","Budhwar Peth","Bund Garden Road","Camp","Chakan","Chandan Nagar","Chandani Chowk","Chande","Chandkhed","Charholi Budruk","Charholi Khurd","Chikhali","Chimbali","Chinchwad","Chourainagar","Dahiwadi","Dapodi","Darumbre","Dattavadi","Dhole Patil Road","Daund","Deccan Gymkhana","Dehu","Dehu Road","Dhangarwadi","Dhankawadi","Dhanore","Dhanori","Dhayari","Dighi","Dive","Donaje","Erandwane","Fatima Nagar","FC Road","Fursungi","Gahunje","Ganesh Nagar","Ganesh Peth","Ganeshkhind","Ganga Dham","Ghorpadi","Ghotawade","Gokhale Nagar","Gudhe","Gultekdi","Guru Nanak Nagar","Guruwar Peth","Hadapsar","Handewadi","Handewadi Road","Haveli","Hingne Khurd","Hinjawadi Phase I","Hinjewadi","Holewadi","Ideal Colony","Indapur","Indira Nagar","Induri","Ingale Nagar","J M Road","Jalochi","Jambhul","Jambhulwadi","Jejuri","Junnar","Kadus","Kalas","Kalewadi","Kalyani Nagar","Kamshet","Kanhe","Kanhur Mesai","Karanja Vihire","Karmoli","Karve Road","Karvenagar","Kasar Amboli","Kasarsai","Kasarwadi","Kasba peth","Katraj","Katraj Kondhwa Road","Kavade Mala","Kelawade","Keshav Nagar","Kesnand","Ketkawale","Khadakwasla","Khadki","Khamundi","Kharadi","Kharadi Bypass Road","Khed","Khed Shivapur","Kirkatwadi","Kiwale","Kodawadi","Kolhewadi","Kolvan","Kolwadi","Kondanpur","Kondhapuri","Kondhawe Dhawade","Kondhwa","Kondhwa","Kondhwa Budruk","Koregaon","Koregaon Bhima","Koregaon Park","Kothrud","Kunjirwadi","Kurkumbh","Landewadi","Lavale","Lavasa","Law College Road","Lohagad","Lohegaon","Lokamanya Nagar","Loni Kalbhor","Lonikand","Lulla Nagar","Maan","Magarpatta","Magarpatta Road","Mahalunge","Mahalunge Ingale","Mahatma Phule Peth","Mahrashi Nagar","Malegaon","Malshiras","Mamurdi","Manchar","Mandai","Mangadewadi","Mangalwar Peth","Manjri","Markal","Market yard","Marunji","Medankarwadi","MG Road","Misalwadi","MIT Collage Road","Model colony","Mohammadwadi","Mohari BK","Moi","Morgaon","Moshi","Moshi Pradhikaran","Mukund Nagar","Mulshi","Mumbai-Pune Expressway","Mundhwa","Mundhwa Road","Nagar Road","Nande","Nanded","Nanekarwadi","Narayan peth","Narayangaon","Narayanpur","Narhe","Nasrapur","Nasrapur Velha Road","NDA Road","Nerhe","NIBM","NIBM Annexe","NIBM Road","Nigdi","Nighoje","Nimgaon Mhalungi","Old Mumbai Pune Highway","Otur","Padmavati","Padvi","Panshet","Pargaon","Parner Pune Highway","Parvati Darshan","Parvati Gaon","Parvati Paytha","Pashan","Pashan Sus Road","Paud","Paud Road","Pawna Nagar","Pimpalgaon Tarf Khed","Pimple Gurav","Pimple Nilakh","Pimple Saudagar","Pimpri","Pimpri Chinchwad","Pingori","Pirangut","Pisoli","Prabhat Road","Pradhikaran","Punawale","Pune Cantonment","Pune Sholapur Road","Pune-Nashik Highway","Purandar","Rahatani","Rajgurunagar","Rambaug Colony","Ramtekdi","Range Hills","Ranjangaon","Ranjangaon Karanjawane Road","Rasta Peth","Ravet","Raviwar Peth","Revenue Colony","Rihe","Sadar Bazaar","Sadashiv Peth","Sahakar Nagar","Sainath Nagar","Salisbury Park","Salunke Vihar","Sanaswadi","Sangamvadi","Sanghavi","Sangvi","Sanjay Park","Sarola","Sasane Nagar","Saswad","Saswad Road","Satara Road","Sate","Senapati Bapat Road","Shaniwar Peth","Shankar shet road","Shastri Nagar","Shetphal Haveli","Shewalwadi","Shikrapur","Shindaone","Shirgaon","Shiroli","Shirur","Shirwal","Shivajinagar","Shivane","Shreehans Nagar","Shukrawar Peth","Sinhagad","Sinhagad Road","Somatane","Somatne Phata","Somwar Peth","Sonde Karla","Sopan Baug","Spine Road","Sukh Sagar Nagar","Sus","Swargate","Talawade","Talegaon chakan Road","Talegaon Dabhade","Talegaon Dhamdhere","Taljai","Tambhad","Tathawade","Thergaon","Theur","Tilak Road","Tingre Nagar","Tukai Darshan","Uday Baug","Uksan","Undri","University Road","Uravade","Uruli Devachi","Uruli Kanchan","Uttam Nagar","Vadgaon Budruk","Vadgaon Maval","Vadgaon Sheri","Vadhu Budruk","Valane","Veerabhadra Nagar","Velhe","Vidyanagar","Viman Nagar","Vishrant Wadi","Vithalwadi","Wadaki","Wadebolai","Wadegaon","Wadgaon Budruk","Wadgaon Sheri","Wadki","Wagholi","Wai","Wakad","Wakadewadi","Walati","Walhe","Walvekar Nagar","Wanwadi","Warje","Yashvant Nagar","Yavat","Yerwada","Yewalewadi","Wanowrie"]
    $scope.locations=[
        {city:"Banglore",zones:[
            {zoneName:"East",areas:["AECS Layout","B Narayanapura","Maheshpallya","Balagere","Basavanagar","Basavanna Nagar","Battarahalli","Belathur","Belatur","Bellandur","Bellandur Outer Ring Road","BEML Layout","Bhaktharahalli","Bhoganhalli","Brookefield","Budigere","Carmelaram","Chansandra","Chikka Tirupathi","Chikka Tirupathi Road","Chikkabasavanapura","Chikkabellandur","Chikkakannalli","Chinnapanna Halli","Choodasandra","CV Raman Nagar","Devasthanagalu","Doddakannalli","Doddenakundi","Dodsworth Layout","Domlur","Dommasandra","Dooravani Nagar","Garudachar Palya","GM Palya","Gollahalli","Gunjur","HAL Layout","Hancharahalli","Haralur Road","Harlur","Hoodi","Hoskote","Immadihalli","Indira Nagar","ITPL Road","Jagadish Nagar","K R Puram","Kadubeesanahalli","Kadugodi","Kaggadasapura","kaikondrahalli","Kamanahalli","Kannamangala","Kartik Nagar","Kasavanahalli","Kempapura","Kithiganur","Kodathi","Kodigehalli - KR Puram","Kodihalli","Kolar Road","Kundalahalli","Kuthaganahalli","LB Shastri Nagar","Krishnarajapura","Mahadevapura","Malleshpalya","Malur-Hosur Road","Marathahalli","Marathahalli ORR","Marathahalli-Sarjapur Outer Ring Road","Munnekollal","Murugeshpalya","Nagondanahalli","Nallurhalli","National Highway 207","New Thippasandra","Off Sarjapur road","Old Airport Road","Old Madras Road","Pai Layout","Panathur","Pattandur Agrahara","Ramagondanahalli","Ramamurthy Nagar","Sarjapur","Sarjapur Attibele Road","Sarjapur Bagalur Road","Sarjapur Road","Seegehalli","Shigehalli","Siddapura","Silver Springs Layout","Sompura","Sonnenahalli","Soukya Road","TC Palya Road","Thippasandra","Thubarahalli","Varthur","Varthur Road","Vignana Nagar","Vinayaka Layout","Whitefield","Whitefield Road","Wind Tunnel Road","Yemalur"]},
            {zoneName:"North",areas:["Amrutha Halli","Anagalapura","Ashirvad Colony","Babusa Palya","Bagalakunte","Bagaluru","Munekollal","Bagepalli","Baiyyappanahalli","Banaswadi","Bellary Road","Bennigana Halli","Bettahalasur","Bhoopasandra","Bidrahalli","Bommenahalli","Byatarayanapura","Byrathi","Chadalapura","Chamundi Nagar","Chelekare","Chikbanavara","Chikka Banaswadi","Chikkaballapur","Chikkaballapur-Gauribidanur Road","Chikkabidarakallu","Chikkajala","Chikkanahalli","Chintamani","Cholanayakanahalli","CQAL Layout","Dabaspete","Dasarahalli Hebbal","Dasarahalli Main Road","Defence Colony - Bagalagunte","Devanahalli","Devanahalli Road","Devinagar","Dodda Banasvadi","Doddaballapur","Doddaballapur Road","Doddabommasandra","Abbigere","Doddenahalli","Dollars Colony","Ganga Nagar","Gauribidanur","Guttahalli","Harohalli","HBR Layout","Hebbal","Hebbal Kempapura","Hegde Nagar","Hennur","Hennur Road","Hesaraghatta","HMT Layout","Horamavu","Horamavu Agara","HRBR Layout","Huttanahalli","International Airport Road","IVC Road","Jakkur","Jakkuru Layout","Jalahalli Cross","Jalahalli East","Jalahalli West","Jangamakote","Jayamahal","K Channasandra","Kadugondanahalli","Kadusonnappanahalli","Kalkere","Kallumantapa","Nagawara","Kalyan Nagar","Kammanahalli","Kanaka Nagar","Kasturi Nagar","Kattigenahalli","Kaval Byrasandra","Kodigehalli","Kogilu","Kolar-Chikkaballapur Road","Kothanoor","Kothanur","Lakshmamma Layout","Lingarajapuram","Malleshwaram","Margondanahalli","Maruthi Nagar","Maruthi Nagar (Yelahanka)","Maruthi Sevanagar","Mathikere","Meenakunte","MS Palya","Munireddy Layout","Nagasandra","Nagavara","Nandi Hills","Nandini Layout","Nanjappa Garden","Narasapura","Nelamangala - Chikkaballapura Road","New BEL Road","NRI Layout","OMBR Layout","R.K. Hegde Nagar","Rachenahalli","Rajanukunte","Rajiv Gandhi Nagar","RMV","RMV 2nd Stage","RMV Extension","RT Nagar","Sadashiva Nagar","Sahakara Nagar","Sanjay Nagar","Seshadripuram","Shettihalli","Sidlaghatta","Singanahalli","Soundarya Layout","Srirampura","T Dasarahalli","Thanisandra","Thanisandra Main Road","Tharabanahalli","Venkatagiri Kote","Vidyaranyapura","Vijaya Bank Colony","Vijaypura","Virupakshapura","Yelahanka","Yelahanka New Town","Yeshwanthpur"]},
            {zoneName:"West",areas:["Adakamaranahalli","Andrahalli","Annapurneshwari Nagar","Arasanakunte","Attiguppe","Bapuji Nagar","Basaveshwara Nagar","Bhuvaneshwari Nagar","Bidadi","Binny Pete","Budihal","Chandra Layout","Dayananda Nagar","Dodda Aalada Mara Road","Donnenahalli","Jagajeevanram Nagar","Jnana Ganga Nagar","Kadabagere","Kamaksipalya","Kamala Nagar","Kunigal Road","Laggere","Magadi Road","Mahalakshmi Layout","Mallathahalli","Mysore Road","Nagarbhavi","Nagarbhavi Circle","Nayanda Halli","Nelamangala","Peenya","Ragavendra Nagar","Rajaji Nagar","Ramohalli","Solur","Sunkadakatte","Thavarekere-Magadi Road","Thurahalli","Tippenahalli","Tumkur Road","Ullal","Vijayanagar","Vishweshwaraiah Layout"]},
            {zoneName:"South",areas:["Adugodi","Akshayanagar","Ananth Nagar","Anekal","Anjanapura","Arekere","Attibele","Azad Nagar","Banashankari","Banashankari","Banashankari 3rd Stage","Banashankari 5th Stage","Bannerghatta Road","Basapura","Basavanagudi","Begur","Begur Road","BEML Layout Raja Rajeshwari Nagar","Bhovi Palya","Bikasipura","Bikkanahalli","Bilekahalli","Bommanahalli","Bommasandra","BTM Layout","BTM Layout Stage 2","BTM Layout Stage 4","Chandapura","Chandapura Anekal Road","Brigade Road,","Devarachikkanahalli","Doddabele","Chikkalasandra","Doddakallasandra","Doddakammanahalli","Doddathoguru","Ejipura","Electronic City Phase I","Electronic City Phase II","Garden Layout","Garvebhavi Palya","Gattahalli","Girinagar","Gottigere","Gubalala","Hanumantha Nagar","Haragadde","Hombegowda Nagar","Hongasandra","Hosa Road","Hosakerehalli","Hosapalaya","Hosur Road","HSR Layout","HSR Layout Sector 1","HSR Layout Sector 2","HSR Layout Sector 3","HSR Layout Sector 4","HSR Layout Sector 5","HSR Layout Sector 6","HSR Layout Sector 7","Hulimavu","Huskur","ISRO Layout","Jakkasandra","Jayanagar","Jigani","JP Nagar","JP Nagar Phase 1","JP Nagar Phase 2","JP Nagar Phase 3","JP Nagar Phase 4","JP Nagar Phase 5","JP Nagar Phase 6","JP Nagar Phase 7","JP Nagar Phase 8","JP Nagar Phase 9","Kaggalipura","Kalena Agrahara","Kammasandra","Kammasandra Agrahara","Kanakapura","Kanakapura Road","Karuna Nagar","Kathriguppe","Kengeri","Kengeri Satellite Town","Kodichikkanahalli","Kodipur","Konanakunte","Koppa","Koramangala","Kudlu","Kudlu Gate","Kumaraswamy Layout","Lake City","Madiwala","Mico Layout","Neeladri Nagar","Nobo Nagar","Padmanabha Nagar","Panduranga Nagar","Raja Rajeshwari Nagar","Rayasandra","Roopena Agrahara","Sadduguntepalya","Seenappa Layout","Shanthi Pura","Silk Board","Singasandra","SMV Layout","Srinagar","Srinivasa Nagar","Subramanyapura","Suryanagar","Talaghattapura","Tavarekere-BTM","Teacher's Colony","Uttarahalli","Uttarahalli","Uttarahalli Main Road","Vasanthapura","Venkatapura","Vittal Nagar","Weavers Colony","Yelachena Halli"]},
            {zoneName:"Central",areas:["Ashok Nagar","Benson Town","Brigade Road","Cambridge Layout","Chamarajpet","Chickpet","Chinnapa Garden","Chandanpura","Commercial Street","Cooke Town","Cottonpete","Cox Town","Craig Park Layout","Cunningham Road","Frazer Town","Gandhi Nagar","Haudin Road","Infantry Road","Jaya Chamarajendra Nagar","Kalasipalayam","Kempegowda Nagar","lal bagh","Langford Road","Langford Town","Lavelle Road","Madhava Nagar","Majestic","MG Road","Millers Road","Neelasandra","Palace Road","Race Course Road","Raghavendra Colony","Residency Road","Rest House Road","Richards Town","Richmond Road","Richmond Town","Sampangi Rama Nagar","Shanthala Nagar","Shanthi Nagar","Shivaji Nagar","St. Johns Road","Sudhama Nagar","Ulsoor","Vasanth Nagar","Victoria Layout","Vittal Mallya Road","Viveka Nagar","Wheeler Road","Williams Town","Wilson Garden"]}
        
        ]},{
            city:"New Delhi",zones:[
                {zoneName:"Central",areas:["Ajmeri Gate","Bapa Nagar","Barakhamba Road","Bhagwan Das Road","Chanakyapuri","Chandni Chowk","Chawri Bazar","Connaught Place","Daryaganj","Gol Market","Golf Links","Indraprastha Estate","Jhandewalan","Karol Bagh","Khan Market","Mandi House","Pahar Ganj","Pragati Maidan","Sadar bazar","Savitri Nagar","Sundar Nagar","Tilak Marg"]},
                {zoneName:"South",areas:["Adchini","AIIMS","Alaknanda","Arjun Nagar","Ashram","Asian Games Village Complex","Aya Nagar","Badarpur","Bahapur","Batla house","Ber Sarai","Bhikaji Cama Place","Bhogal","C R Park","Chhatarpur","Chirag Delhi","Chittaranjan Park","Dakshinpuri","Defence Colony","Dera Mandi","Devli","East Of Kailash","Fatehpur Beri","Freedom Fighter Enclave","Gautam Nagar","Ghitorni","Govindpuri","Govindpuri Extension","Greater Kailash I","Greater Kailash II","Greater Kailash III","Green Park","Green Park Extension","Gulmohar Park","Hauz Khas","Hauz Khas Enclave","Jaitpur","Jangpura","Jasola","Jor Bagh","Kailash Colony","Kalindi Kunj","Kalkaji","Kalu Sarai","Katwaria Sarai","Khanpur","Khirki Extension","Kidwai Nagar","Lado Sarai","Lajpat Nagar","Lakshmi Bai Nagar","Lal Kuan","Lodi Colony","Madangir","Madanpur Khadar","Maharani Bagh","Maidangarhi","Malviya Nagar","Mehrauli","Mithapur","Moti Bagh","Munirka","Navjeevan Vihar","Neb Sarai","Nehru Place","New Friends Colony","Nizamuddin","Okhla","Panchsheel Enclave","Panchsheel Park","Pulpahladpur","Pushp Vihar","R K Puram","Sadiq Nagar","Safdarjung Development Area","Safdarjung Enclave","Sainik Farm","Saket","Sangam Vihar","Sant Nagar","Sarai Kale Khan","Sarita Vihar","Sarojini Nagar","Satbari","Sheikh Sarai","Sidhartha Nagar","Siri Fort","Soami Nagar","South Extension Part 1","South Extension Part 2","Sri Niwaspuri","Sukhdev Vihar","Sultanpur","Sunlight Colony","Tughlakabad","Uday Park","Vasant Kunj","Vasant Vihar","Yusuf Sarai","Ajmeri Gate","Bapa Nagar","Barakhamba Road","Bhagwan Das Road","Chanakyapuri","Chandni Chowk","Chawri Bazar","Connaught Place","Daryaganj","Gol Market","Golf Links","Indraprastha Estate","Jhandewalan","Karol Bagh","Khan Market","Mandi House","Pahar Ganj","Pragati Maidan","Sadar bazar","Savitri Nagar","Sundar Nagar","Tilak Marg"]},
                {zoneName:"North",areas:["Bharat Nagar","Burari","Civil Lines","G T B Nagar","Gopalpur Village","Gulabi Bagh","Jharoda Majra Burari","Kalyan Vihar","Kamla Nagar","Kashmiri Gate","Malka Ganj","Mukherjee Nagar","Mukundpur","Roop Nagar","Sarai Rohilla","Shakti Nagar","Shastri Nagar","Timarpur","Tis hazari","Vijay Nagar","Wazirabad","Zone P II","Babarpur","Chaman Vihar","Gokalpur","GTB Enclave","Johripur","Karawal Nagar","Khajoori Khas","Mustafabad","Seemapuri","Sonia Vihar","Vijay Vihar","Adarsh Nagar","Alipur","Ashok Vihar","Azadpur","Jamia Nagar","Bakhtawarpur","Bawana","Begumpur","Bhalswa","Budh Vihar","Daya Basti","Gujranwala Town","Inder Enclave","Inderlok","Jahangir Puri","Kanjhawala","Karala","Karampura","Keshavpuram","Khera Kalan","Lawrence Road","Mangolpuri","Model Town","Narela","Pitampura","Prem Nagar","Rani Bagh","Rithala","Rohini","Rohini Extension","Rohini Sector 1","Rohini Sector 10","Rohini Sector 11","Rohini Sector 12","Rohini Sector 13","Rohini Sector 14","Rohini Sector 15","Rohini Sector 16","Rohini Sector 17","Rohini Sector 18","Rohini Sector 19","Rohini Sector 2","Rohini Sector 20","Rohini Sector 21","Rohini Sector 22","Rohini Sector 23","Rohini Sector 24","Rohini Sector 25","Rohini Sector 27","Rohini Sector 28","Rohini Sector 29","Rohini Sector 3","Rohini Sector 30","Rohini Sector 32","Rohini Sector 34","Rohini Sector 35","Rohini Sector 38","Rohini Sector 4","Rohini Sector 5","Rohini Sector 6","Rohini Sector 7","Rohini Sector 8","Rohini Sector 9","Rohini Sector-36","Rohini Sector-37","Sawda","Shakurpur","Shalimar Bagh","Singhu","Siraspur","Sultanpuri","Tri Nagar","Vaishali","Wazirpur","West Enclave"]},
                {zoneName:"North East",areas:["Babarpur","Chaman Vihar","Gokalpur","GTB Enclave","Johripur","Karawal Nagar","Khajoori Khas","Mustafabad","Seemapuri","Sonia Vihar","Vijay Vihar","Badli"]},
                {zoneName:"North West",areas:["Adarsh Nagar","Alipur","Ashok Vihar","Azadpur","Badli","Bakhtawarpur","Bawana","Begumpur","Bhalswa","Budh Vihar","Daya Basti","Gujranwala Town","Inder Enclave","Inderlok","Jahangir Puri","Kanjhawala","Karala","Karampura","Keshavpuram","Khera Kalan","Lawrence Road","Mangolpuri","Model Town","Narela","Pitampura","Prem Nagar","Rani Bagh","Rithala","Rohini","Rohini Extension","Rohini Sector 1","Rohini Sector 10","Rohini Sector 11","Rohini Sector 12","Rohini Sector 13","Rohini Sector 14","Rohini Sector 15","Rohini Sector 17","Rohini Sector 18","Rohini Sector 19","Rohini Sector 2","Rohini Sector 20","Rohini Sector 21","Rohini Sector 22","Rohini Sector 23","Rohini Sector 24","Rohini Sector 25","Rohini Sector 27","Rohini Sector 28","Rohini Sector 29","Rohini Sector 3","Rohini Sector 30","Rohini Sector 32","Rohini Sector 34","Rohini Sector 35","Rohini Sector 38","Rohini Sector 4","Rohini Sector 5","Rohini Sector 6","Rohini Sector 7","Rohini Sector 8","Rohini Sector 9","Rohini Sector-36","Rohini Sector-37","Sawda","Shakurpur","Shalimar Bagh","Singhu","Siraspur","Sultanpuri","Tri Nagar","Vaishali","Wazirpur","West Enclave"]},
                {zoneName:"West",areas:["Adarsh Nagar","Alipur","Ashok Vihar","Azadpur","Badli","Bakhtawarpur","Bawana","Begumpur","Bhalswa","Budh Vihar","Daya Basti","Gujranwala Town","Inder Enclave","Inderlok","Jahangir Puri","Kanjhawala","Karala","Karampura","Keshavpuram","Khera Kalan","Lawrence Road","Mangolpuri","Model Town","Narela","Pitampura","Prem Nagar","Rani Bagh","Rithala","Rohini","Rohini Extension","Rohini Sector 1","Rohini Sector 10","Rohini Sector 11","Rohini Sector 12","Rohini Sector 13","Rohini Sector 14","Rohini Sector 15","Rohini Sector 17","Rohini Sector 18","Rohini Sector 19","Rohini Sector 2","Rohini Sector 20","Rohini Sector 21","Rohini Sector 22","Rohini Sector 23","Rohini Sector 24","Rohini Sector 25","Rohini Sector 27","Rohini Sector 28","Rohini Sector 29","Rohini Sector 3","Rohini Sector 30","Rohini Sector 32","Rohini Sector 34","Rohini Sector 35","Rohini Sector 38","Rohini Sector 4","Rohini Sector 5","Rohini Sector 6","Rohini Sector 7","Rohini Sector 8","Rohini Sector 9","Rohini Sector-36","Rohini Sector-37","Sawda","Shakurpur","Shalimar Bagh","Singhu","Siraspur","Sultanpuri","Tri Nagar","Vaishali","Wazirpur","West Enclave"]},
                {zoneName:"South West",areas:["Bijwasan","Chhawla","Dabri","Dashrath Puri","Deenpur","Delhi Cantoment","Dhaula Kuan","Dwarka","Dwarka Mor","Dwarka Sector 11","Dwarka Sector 12","Dwarka Sector 13","Dwarka Sector 14","Dwarka Sector 15","Dwarka Sector 16","Dwarka Sector 16 A","Dwarka Sector 16 B","Dwarka Sector 17","Dwarka Sector 18","Dwarka Sector 19","Dwarka Sector 19B","Dwarka Sector 2","Dwarka Sector 20","Dwarka Sector 21","Dwarka Sector 22","Dwarka Sector 23","Dwarka Sector 24","Dwarka Sector 26","Dwarka Sector 27","Dwarka Sector 28","Dwarka Sector 3","Dwarka Sector 4","Dwarka Sector 5","Dwarka Sector 6","Dwarka Sector 7","Dwarka Sector 8","Dwarka Sector 9","Subhash Nagar","Dwarka Sector-10","Goyla Village","Kakrola","Kapashera","L Zone","Mahavir Enclave","Mahipalpur","Manglapuri","Matiala","Najafgarh","Naraina","Palam","Qutub Vihar","Raj Nagar","Rangpuri","Razapur Khurd","Sagar Pur"]},
                 {zoneName:"East",areas:["Akshar Dham","Anand Vihar","Azad Nagar","Balbir Nagar","Bhajanpura","Brahmpuri","Dilshad Garden","Gagan Vihar","Gandhi Nagar","Ganesh Nagar","Geeta Colony","Ghazipur","Harsh Vihar","Indraprastha Extension","Jhilmil Colony","Karkardooma","Khureji","Kondli","Krishna Nagar","Laxmi Nagar","Mandawali","Mayur Vihar","Mayur Vihar Phase 1","Mayur Vihar Phase 1 Extension","Mayur Vihar Phase 2","Mayur Vihar Phase 3","New Ashok Nagar","Nirman Vihar","Pandav Nagar","Patparganj","Preet Vihar","Savita Vihar","Seelampur","Shahdara","Shakarpur","Shastri Park","Trilokpuri","Neharpar Faridabad","Vigyan Vihar","Village Mandoli","Vinod Nagar East","Vinod Nagar West","Vivek Vihar","Yamuna Vihar","Yojana Vihar","Welcome","Mansorovar park","kaushambi","vaishali","yamuna bank"]},
    
            ]
        },{
            city:"Gurgaon",zones:[
                {zoneName:"Gurgaon",areas:["Ashok Vihar Phase II","Ashok Vihar Phase III","Bhondsi","Bissar Akbarpur","Budhera","Civil Lines","DLF Phase 1","DLF Phase 2","DLF Phase 3","DLF Phase 4","DLF Phase 5","Dwarka Expressway","Farukh Nagar","Garhi Harsaru","Golf Course Extn","Golf Course Road","Gurgaon-Faridabad Road","Gwal Pahari","Jhajjar Road","Khandsa road","Manesar","Mankrola","MG Road","New Gurgaon","NH 8","Palam Vihar","Palam Vihar Extension","Pataudi","Patel Nagar","Sector-1","Sector-10","Sector-10 A","Sector-100","Sector-101","Sector-102","Sector-103","Sector-103A","Gyan Khand I","Sector-105","Sector-106","Sector-107","Sector-108","Sector-109","Sector-11","Sector-110","Sector-110 A","Sector-111","Sector-112","Sector-113","Sector-114","Sector-115","Sector-12","Sector-12 A","Sector-13","Sector-14","Sector-15","Sector-16","Sector-17","Sector-18","Sector-19","Sector-2","Sector-20","Sector-21","Sector-22","Sector-23","Sector-23 A","Sector-24","Sector-25","Sector-26","Sector-26 A","Sector-27","Sector-28","Sector-29","Sector-3","Sector-3 A","Sector-30","Sector-31","Sector-32","Sector-33","Sector-34","Sector-35","Sector-36","Sector-37","Sector-37 A","Sector-37 B","Sector-37 C","Sector-37 D","Sector-38","Sector-39","Sector-4","Sector-40","Sector-41","Sector-42","Sector-43","Sector-44","Sector-45","Sector-46","Sector-47","Sector-48","Sector-49","Sector-5","Sector-50","Sector-51","Sector-52","Sector-52 A","Sector-53","Sector-54","Sector-55","Sector-56","Sector-57","Sector-58","Sector-59","Sector-6","Sector-60","Sector-61","Sector-62","Sector-63","Sector-64","Sector-65","Sector-66","Sector-67","Sector-68","Sector-69","Sector-7","Sector-70","Sector-70 A","Sector-71","Sector-72","Sector-73","Sector-74","Sector-74 A","Sector-75","Sector-76","Sector-77","Sector-78","Sector-79","Sector-8","Sector-80","Sector-81","Sector-81 A","Sector-82","Sector-82 A","Sector-83","Sector-84","Sector-85","Sector-86","Sector-87","Sector-88","Sector-88A","Sector-88B","Sector-89","Sector-89A","Sector-9","Sector-9 A","Sector-9 B","Sector-90","Sector-91","Sector-92","Sector-93","Sector-94","Sector-95","Sector-95A","Sector-95B","Sector-96","Sector-97","Sector-98","Sector-99","Sector-99A","Sohna","Sohna Road","Sohna Sector-11","Sohna Sector-14","Sohna Sector-17","Sohna Sector-2","Sohna Sector-25","Sohna Sector-33","Sohna Sector-34","Sohna Sector-35","Sohna Sector-36","Sohna Sector-4","Sohna Sector-5","Sohna Sector-6","Sohna Sector-7","South City","Sultanpur","Sushant Lok I","Sushant Lok Phase 2","Sushant Lok Phase 3"]}
            ]
        },{
            city:"Faridabad",zones:[
                {zoneName:"Faridabad",areas:["Agwanpur","Ajit Nagar","Ankhir","Ashoka Enclave","Ashoka Enclave 3","Asoati","Badhkal","Ballabhgarh","Basantpur","Bhopani Village","Chandpur","Charmwood Village","Chawla Colony","Dabuwa Colony","Dayal Bagh","Dhouj","Eros Garden","Fatehpur Billoch","Friends Colony","Gandhi Colony","Gazipur","Green Fields","Gurukul Basti","Indraprastha Colony","Ismailpur","Jasana","Jawahar Colony","Jeevan Nagar","Kabulpur","Kanwara Village","Katan Pahari","Kirawali","Manjhawali Village","Mathura Road","Mewala Maharajpur","Mithapur","Nangla Gujran","Dwarka Sector-1","Nehru Colony","New Industrial Township","New Industrial Township No 1","New Industrial Township No 2","New Industrial Township No 3","New Industrial Township No 4","New Industrial Township No 5","Old Chungi","Old Faridabad","Pali","Palwal","Palwal Alighar Highyway","Parvatiya Colony","Pirthla","Railway Colony","Rajpur Kalan","Sainik Colony","Sector-1","Sector-10","Sector-104","Sector-109","Sector-11","Sector-12","Sector-13","Sector-132","Sector-14","Sector-15","Sector-15A","Sector-16","Sector-16A","Sector-17","Sector-18","Sector-19","Sector-2","Sector-20","Sector-20A","Sector-21A","Sector-21B","Sector-21C","Sector-21D","Sector-22","Sector-23","Sector-24","Sector-25","Sector-27","Sector-27A","Sector-28","Sector-29","Sector-3","Sector-30","Sector-31","Sector-32","Sector-33","Sector-34","Sector-35","Sector-36","Sector-37","Sector-39","Sector-4","Sector-41","Sector-42","Sector-43","Sector-45","Sector-46","Sector-48","Sector-49","Sector-5","Sector-50","Sector-51","Sector-52","Sector-53","Sector-54","Sector-55","Sector-56","Sector-57","Sector-58","Sector-59","sector-6","Sector-62","Sector-63","Sector-64","Sector-65","Sector-67","Sector-69","Sector-7","Sector-70","Sector-71","Sector-72","Sector-75","Sector-76","Sector-77","Sector-78","Sector-79","Sector-8","Sector-80","Sector-81","Sector-82","Sector-83","Sector-84","Sector-85","Sector-86","Sector-87","Sector-88","Sector-89","Sector-9","Sector-91","Sector-97","Sector-99","Sehatpur","Shastri Colony","Shiv Durga Vihar","Sholaka","Sikri","Spring Field Colony","Suraj Kund","Surajkund Road","Surya Nagar","Tigaon","Tikawali village","Tilpat","Vinay Nagar","Yadav Colony"]}
            ]
        },{
            city:"Noida",zones:[
                {zoneName:"Noida",areas:["Dadri Road","Sector-1","Sector-10","Sector-100","Sector-101","Sector-102","Sector-104","Sector-105","Sector-106","Sector-107","Sector-108","Sector-11","Sector-110","Sector-112","Sector-113","Sector-115","Sector-116","Sector-117","Sector-118","Sector-119","Sector-12","Sector-120","Sector-121","Sector-122","Sector-123","Sector-124","Sector-125","Sector-126","Sector-127","Sector-128","Sector-129","Sector-130","Sector-131","Sector-132","Sector-133","Sector-134","Sector-135","Vasundhara Enclave","Sector-137","Sector-138","Sector-14","Sector-14 A","Sector-140","Sector-140 A","Sector-141","Sector-142","Sector-143","Sector-143 A","Sector-143 B","Sector-144","Sector-145","Sector-146","Sector-147","Sector-148","Sector-149","Sector-15","Sector-15 A","Sector-150","Sector-151","Sector-152","Sector-153","Sector-154","Sector-155","Sector-156","Sector-157","Sector-158","Sector-159","Sector-16","Sector-16 A","Sector-16 B","Sector-160","Sector-161","Sector-162","Sector-163","Sector-164","Sector-165","Sector-166","Sector-167","Sector-167 B","Sector-168","Sector-17","Sector-18","Sector-19","Sector-2","Sector-20","Sector-21","Sector-22","Sector-23","Sector-24","Sector-25","Sector-25 A","Sector-26","Sector-27","Sector-28","Sector-29","Sector-3","Sector-30","Sector-31","Sector-32","Sector-33","Sector-34","Sector-35","Sector-36","Sector-37","Sector-38","Sector-39","Sector-4","Sector-40","Sector-41","Sector-42","Sector-43","Sector-44","Sector-45","Sector-46","Sector-47","Sector-48","Sector-49","Sector-5","Sector-50","Sector-51","Sector-52","Sector-53","Sector-55","Sector-56","Sector-57","Sector-58","Sector-59","Sector-6","Sector-60","Sector-61","Sector-62","Sector-62 A","Sector-63","Sector-64","Sector-65","Sector-66","Sector-67","Sector-68","Sector-69","Sector-7","Sector-70","Sector-71","Sector-72","Sector-73","Sector-74","Sector-75","Sector-76","Sector-77","Sector-78","Sector-79","Sector-8","Sector-80","Sector-81","Sector-82","Sector-83","Sector-84","Sector-85","Sector-86","Sector-87","Sector-88","Sector-89","Sector-9","Sector-90","Sector-91","Sector-92","Sector-93","Sector-93 A","Sector-93 B","Sector-94","Sector-94 A","Sector-95","Sector-96","Sector-97","Sector-98","Sector-99","Sorkha","AWHO III","Bhanauta","Bodaki","Dadri","Devla","Dhoom Manikpur","ECOTECH II","ECOTECH III","Girdharpur","Gulistanpur","Jaypee Greens","Kasna","Knowledge Park-1","Knowledge Park-2","Knowledge Park-3","Knowledge Park-4","Knowledge Park-5","Kulesara","Lakhnawali","LOCALITY","NH-91","NH-91 Dadri","Noida Extension","OMICRON I","OMICRON I A","OMICRON II","OMICRON III","Pari Chowk","Sector Alpha I","Sector Alpha II","Sector BETA I","Sector BETA II","Sector CHI II","Sector CHI III","Sector CHI IV","Sector CHI V","Sector DELTA I","Sector DELTA II","Janakpuri","Sector ETA I","Sector ETA II","Sector GAMMA I","Sector GAMMA II","Sector MU","Sector MU I","Sector MU II","Sector OMEGA I","Sector OMEGA II","Sector PHI I","Sector PHI II","Sector PHI III","Sector PHI IV","Sector PI I & II","Sector RHO I","Sector RHO II","Sector XU I","Sector XU II","Sector XU III","Sector ZETA I","Sector ZETA II","Sector-1","Sector-10","Sector-11","Sector-12","Sector-12 A","Sector-16","Sector-16B","Sector-16C","Sector-2","Sector-27","Sector-3","Sector-36","Sector-4","Shahberi","SIGMA I","SIGMA II","SIGMA III","SIGMA IV","Surajpur","Suthiyana","Swaran Nagari","Tech Zone","Tech Zone IV","Theta II","Tilpata Karanwas","UPSIDC","Yamuna Expressway"]}
            ]
        },{
            city:"Greater Noida",zones:[
                {zoneName:"Greater Noida",areas:["Dadri Road","Sector-1","Sector-10","Sector-100","Sector-101","Sector-102","Sector-104","Sector-105","Sector-106","Sector-107","Sector-108","Sector-11","Sector-110","Sector-112","Sector-113","Sector-115","Sector-116","Sector-117","Sector-118","Sector-119","Sector-12","Sector-120","Sector-121","Sector-122","Sector-123","Sector-124","Sector-125","Sector-126","Sector-127","Sector-128","Sector-129","Sector-130","Sector-131","Sector-132","Sector-133","Sector-134","Sector-135","Vasundhara Enclave","Sector-137","Sector-138","Sector-14","Sector-14 A","Sector-140","Sector-140 A","Sector-141","Sector-142","Sector-143","Sector-143 A","Sector-143 B","Sector-144","Sector-145","Sector-146","Sector-147","Sector-148","Sector-149","Sector-15","Sector-15 A","Sector-150","Sector-151","Sector-152","Sector-153","Sector-154","Sector-155","Sector-156","Sector-157","Sector-158","Sector-159","Sector-16","Sector-16 A","Sector-16 B","Sector-160","Sector-161","Sector-162","Sector-163","Sector-164","Sector-165","Sector-166","Sector-167","Sector-167 B","Sector-168","Sector-17","Sector-18","Sector-19","Sector-2","Sector-20","Sector-21","Sector-22","Sector-23","Sector-24","Sector-25","Sector-25 A","Sector-26","Sector-27","Sector-28","Sector-29","Sector-3","Sector-30","Sector-31","Sector-32","Sector-33","Sector-34","Sector-35","Sector-36","Sector-37","Sector-38","Sector-39","Sector-4","Sector-40","Sector-41","Sector-42","Sector-43","Sector-44","Sector-45","Sector-46","Sector-47","Sector-48","Sector-49","Sector-5","Sector-50","Sector-51","Sector-52","Sector-53","Sector-55","Sector-56","Sector-57","Sector-58","Sector-59","Sector-6","Sector-60","Sector-61","Sector-62","Sector-62 A","Sector-63","Sector-64","Sector-65","Sector-66","Sector-67","Sector-68","Sector-69","Sector-7","Sector-70","Sector-71","Sector-72","Sector-73","Sector-74","Sector-75","Sector-76","Sector-77","Sector-78","Sector-79","Sector-8","Sector-80","Sector-81","Sector-82","Sector-83","Sector-84","Sector-85","Sector-86","Sector-87","Sector-88","Sector-89","Sector-9","Sector-90","Sector-91","Sector-92","Sector-93","Sector-93 A","Sector-93 B","Sector-94","Sector-94 A","Sector-95","Sector-96","Sector-97","Sector-98","Sector-99","Sorkha","AWHO III","Bhanauta","Bodaki","Dadri","Devla","Dhoom Manikpur","ECOTECH II","ECOTECH III","Girdharpur","Gulistanpur","Jaypee Greens","Kasna","Knowledge Park-1","Knowledge Park-2","Knowledge Park-3","Knowledge Park-4","Knowledge Park-5","Kulesara","Lakhnawali","LOCALITY","NH-91","NH-91 Dadri","Noida Extension","OMICRON I","OMICRON I A","OMICRON II","OMICRON III","Pari Chowk","Sector Alpha I","Sector Alpha II","Sector BETA I","Sector BETA II","Sector CHI II","Sector CHI III","Sector CHI IV","Sector CHI V","Sector DELTA I","Sector DELTA II","Janakpuri","Sector ETA I","Sector ETA II","Sector GAMMA I","Sector GAMMA II","Sector MU","Sector MU I","Sector MU II","Sector OMEGA I","Sector OMEGA II","Sector PHI I","Sector PHI II","Sector PHI III","Sector PHI IV","Sector PI I & II","Sector RHO I","Sector RHO II","Sector XU I","Sector XU II","Sector XU III","Sector ZETA I","Sector ZETA II","Sector-1","Sector-10","Sector-11","Sector-12","Sector-12 A","Sector-16","Sector-16B","Sector-16C","Sector-2","Sector-27","Sector-3","Sector-36","Sector-4","Shahberi","SIGMA I","SIGMA II","SIGMA III","SIGMA IV","Surajpur","Suthiyana","Swaran Nagari","Tech Zone","Tech Zone IV","Theta II","Tilpata Karanwas","UPSIDC","Yamuna Expressway"]}
            ]
        },{
            city:"Ghaziabad",zones:[
                {zoneName:"Ghaziabad",areas:["Abhay Khand","Abhay Khand 2","Shalimar Garden Extention 1","Ahinsa Khand I","Ahinsa Khand II","Ambedkar Road","Amrit Nagar","Ankur Vihar","Avantika","Shastri Nagar","Bhopura","Bhram Puri","Shatabdipuram","Bhuapur","Chander Nagar","Chhapraula","Siddharth Vihar","Surya Nagar","Swaran Jyanti Puram","Chipiyana Buzurg","Chiranjiv Vihar","Crossing Republik","Trans Delhi Signature City","Dasna","Vaibhav Khand","Daulatpura","Defence Colony","Dhoom Manikpur","Dilshad Extension","Dilshad Plaza","Dundahera","Farukh Nagar","Ghukna","Vaishali","Vaishali Extension","Govind Puram","GT Road","Sector-36","Gyan Khand II","Gyan Khand III","Gyan Khand IV","Hapur Road","Harbans Nagar","Harsaon","Hindan Residential Area","Vaishali Sector-1","Indirapuram","Indraprastha Yojna","Janakpuri","Kala Patther","Vaishali Sector-2","Kamla Nehru Nagar","Kaushambi","Kavi Nagar","Kinauni Village","Koyal Enclave","Vaishali Sector-3","Krishna Vihar","Vaishali Sector-5","Lajpat Nagar","Lal Kuan","Lalbag Colony","Lohia Nagar","Loni","Madhopura","Madhuban Bapudham","Mahurali","Maliwara","Marium Nagar","Masuri","Model Town","Modinagar","Vaishali Sector-9","Mohan Nagar","Muradnagar","Nai Basti Dundahera","Nandgram","Naya Ganj","Neelmani Colony","Nehru Nagar","Nehru Nagar-II","Nehru Nagar-III","NH-24","Vasundhara","NH-58","NH-91","Vasundhara Sector-1","Niti Khand I","Niti Khand II","Niti Khand III","Vasundhara Sector-10","Nyay Khand I","Nyay Khand II","Nyay Khand III","Panchsheel Enclave","Pandav Nagar","Patel Nagar","Pilkhuwa","Pratap Vihar","Raghunathpur","Raispur","Raj Nagar","Vasundhara Sector-11","Raj Nagar Extension","Rajendra Nagar","Ramprastha","RK Puram","Sadiqpur","Sahibabad","Sanjay Nagar","Sehani Khurd","Sewa Nagar","Vasundhara Sector-12","Shahpur Bamheta","Vasundhara Sector-13","Shakti Khand I","Shakti Khand II","Shakti Khand III","Shakti Khand IV","Shalimar Garden","Ghaziabad","Vasundhara Sector-14","Vasundhara Sector-15","Vasundhara Sector-16","Vasundhara Sector-17","Vasundhara Sector-18","Vasundhara Sector-19","Vasundhara Sector-2A","Vasundhara Sector-2B","Vasundhara Sector-2C","Vasundhara Sector-3","Vasundhara Sector-4","Vasundhara Sector-5","Vasundhara Sector-6","Vasundhara Sector-7","Vasundhara Sector-8","Vasundhara Sector-9","Ved Vihar","Vijay Nagar","Vikram Enclave","Wave City"]}
            ]
        },{
            city:"Pune",zones:[
                {zoneName:"Pune",areas:["Sahakar Nagar","Navi Peth","Bhor","Aambethan","Agarkar Nagar","Akurdi","Alandi","Alandi Road","Alephata","Ambarwet","Ambavane","Ambegaon Budruk","Ambegaon Khurd","Anand Nagar","Ashok Nagar","Ashtapur","Aundh","Aundh Road","Awhalwadi","Bahul","Bajirao Road","Bakori","Balaji Nagar","Balewadi","Baner","Baner Bypass Highway","Baner Pashan Link Road","Baramati","Bavdhan","Bhaginghar","Bhawani Peth","Bhekrai Nagar","Bhilarewadi","Bhoirwadi","Bhor","Bhosale Nagar","Bhosari","Bhugaon","Bhukum","Bhandarkar Road","Bhusari Colony","Bibwewadi","Boat Club Road","Bope","Bopgaon","Bopkhel","Bopodi","Boripardhi","BT Kawade Road","Budhwar Peth","Bund Garden Road","Camp","Chakan","Chandan Nagar","Chandani Chowk","Chande","Chandkhed","Charholi Budruk","Charholi Khurd","Chikhali","Chimbali","Chinchwad","Chourainagar","Dahiwadi","Dapodi","Darumbre","Dattavadi","Dhole Patil Road","Daund","Deccan Gymkhana","Dehu","Dehu Road","Dhangarwadi","Dhankawadi","Dhanore","Dhanori","Dhayari","Dighi","Dive","Donaje","Erandwane","Fatima Nagar","FC Road","Fursungi","Gahunje","Ganesh Nagar","Ganesh Peth","Ganeshkhind","Ganga Dham","Ghorpadi","Ghotawade","Gokhale Nagar","Gudhe","Gultekdi","Guru Nanak Nagar","Guruwar Peth","Hadapsar","Handewadi","Handewadi Road","Haveli","Hingne Khurd","Hinjawadi Phase I","Hinjewadi","Holewadi","Ideal Colony","Indapur","Indira Nagar","Induri","Ingale Nagar","J M Road","Jalochi","Jambhul","Jambhulwadi","Jejuri","Junnar","Kadus","Kalas","Kalewadi","Kalyani Nagar","Kamshet","Kanhe","Kanhur Mesai","Karanja Vihire","Karmoli","Karve Road","Karvenagar","Kasar Amboli","Kasarsai","Kasarwadi","Kasba peth","Katraj","Katraj Kondhwa Road","Kavade Mala","Kelawade","Keshav Nagar","Kesnand","Ketkawale","Khadakwasla","Khadki","Khamundi","Kharadi","Kharadi Bypass Road","Khed","Khed Shivapur","Kirkatwadi","Kiwale","Kodawadi","Kolhewadi","Kolvan","Kolwadi","Kondanpur","Kondhapuri","Kondhawe Dhawade","Kondhwa","Kondhwa","Kondhwa Budruk","Koregaon","Koregaon Bhima","Koregaon Park","Kothrud","Kunjirwadi","Kurkumbh","Landewadi","Lavale","Lavasa","Law College Road","Lohagad","Lohegaon","Lokamanya Nagar","Loni Kalbhor","Lonikand","Lulla Nagar","Maan","Magarpatta","Magarpatta Road","Mahalunge","Mahalunge Ingale","Mahatma Phule Peth","Mahrashi Nagar","Malegaon","Malshiras","Mamurdi","Manchar","Mandai","Mangadewadi","Mangalwar Peth","Manjri","Markal","Market yard","Marunji","Medankarwadi","MG Road","Misalwadi","MIT Collage Road","Model colony","Mohammadwadi","Mohari BK","Moi","Morgaon","Moshi","Moshi Pradhikaran","Mukund Nagar","Mulshi","Mumbai-Pune Expressway","Mundhwa","Mundhwa Road","Nagar Road","Nande","Nanded","Nanekarwadi","Narayan peth","Narayangaon","Narayanpur","Narhe","Nasrapur","Nasrapur Velha Road","NDA Road","Nerhe","NIBM","NIBM Annexe","NIBM Road","Nigdi","Nighoje","Nimgaon Mhalungi","Old Mumbai Pune Highway","Otur","Padmavati","Padvi","Panshet","Pargaon","Parner Pune Highway","Parvati Darshan","Parvati Gaon","Parvati Paytha","Pashan","Pashan Sus Road","Paud","Paud Road","Pawna Nagar","Pimpalgaon Tarf Khed","Pimple Gurav","Pimple Nilakh","Pimple Saudagar","Pimpri","Pimpri Chinchwad","Pingori","Pirangut","Pisoli","Prabhat Road","Pradhikaran","Punawale","Pune Cantonment","Pune Sholapur Road","Pune-Nashik Highway","Purandar","Rahatani","Rajgurunagar","Rambaug Colony","Ramtekdi","Range Hills","Ranjangaon","Ranjangaon Karanjawane Road","Rasta Peth","Ravet","Raviwar Peth","Revenue Colony","Rihe","Sadar Bazaar","Sadashiv Peth","Sahakar Nagar","Sainath Nagar","Salisbury Park","Salunke Vihar","Sanaswadi","Sangamvadi","Sanghavi","Sangvi","Sanjay Park","Sarola","Sasane Nagar","Saswad","Saswad Road","Satara Road","Sate","Senapati Bapat Road","Shaniwar Peth","Shankar shet road","Shastri Nagar","Shetphal Haveli","Shewalwadi","Shikrapur","Shindaone","Shirgaon","Shiroli","Shirur","Shirwal","Shivajinagar","Shivane","Shreehans Nagar","Shukrawar Peth","Sinhagad","Sinhagad Road","Somatane","Somatne Phata","Somwar Peth","Sonde Karla","Sopan Baug","Spine Road","Sukh Sagar Nagar","Sus","Swargate","Talawade","Talegaon chakan Road","Talegaon Dabhade","Talegaon Dhamdhere","Taljai","Tambhad","Tathawade","Thergaon","Theur","Tilak Road","Tingre Nagar","Tukai Darshan","Uday Baug","Uksan","Undri","University Road","Uravade","Uruli Devachi","Uruli Kanchan","Uttam Nagar","Vadgaon Budruk","Vadgaon Maval","Vadgaon Sheri","Vadhu Budruk","Valane","Veerabhadra Nagar","Velhe","Vidyanagar","Viman Nagar","Vishrant Wadi","Vithalwadi","Wadaki","Wadebolai","Wadegaon","Wadgaon Budruk","Wadgaon Sheri","Wadki","Wagholi","Wai","Wakad","Wakadewadi","Walati","Walhe","Walvekar Nagar","Wanwadi","Warje","Yashvant Nagar","Yavat","Yerwada","Yewalewadi","Wanowrie"]}
            ]
        },{
            city:"Chandigarh",zones:[
                {zoneName:"Chandigarh",areas:["More Chandigarh Locality Maps","Manimajra","Burail","DLF Mullanpur","Industrial Area Phase I","Industrial Area Phase II","M.C.Dhanas","Madhya Marg","Manimajra","Mohali","Ram Darbar","Sector 1","Sector 10","Sector 10A","Sector 10D","Sector 11","Sector 11A","Sector 11B","Sector 11D","Sector 12","Sector 14","Sector 15","Sector 15A","Sector 15B","Sector 15C","Sector 15D","Sector 16","Sector 16A","Sector 16D","Sector 17","Sector 17A","Sector 17B","Sector 17D","Sector 17E","Sector 18","sector 18A","Sector 18B","Sector 18C","Sector 19","Sector 19A","Sector 19B","Sector 19C","Sector 19D","Sector 20","Sector 20A","Sector 20C","Sector 20D","Sector 21","Sector 21A","Sector 21B","Sector 21C","Sector 21D","Sector 22","Sector 22A","Sector 22B","Sector 22C","Sector 22D","Sector 23","Sector 23C","Sector 23D","Sector 24C","Sector 24D","Sector 26","Sector 27","Sector 27A","Sector 27C","Sector 27D","Sector 28","Sector 28 C","Sector 28 D","Sector 28A","Sector 29","Sector 29D","Sector 30","Sector 31","Sector 31D","Sector 32","Sector 32A","Sector 32C","Sector 32D","Sector 33A","Sector 33C","Sector 33D","Sector 34","Sector 34A","Sector 34C","Sector 34C","Sector 34D","Sector 35","Sector 35A","Sector 35B","Sector 35C","Sector 35D","Sector 36","Sector 36A","Sector 36C","Sector 36D","Sector 37","Sector 37A","Sector 37B","Sector 37C","Sector 37D","Sector 38","Sector 38 West","Sector 38A","Sector 38B","Sector 38C","Sector 38D","Sector 4","Sector 40","Sector 40A","Sector 40B","Sector 40C","Sector 40C","Sector 40D","Sector 41 D","Sector 42","Sector 42B","Sector 42C","Sector 43A","Sector 43B","Sector 44","Sector 44A","Sector 44B","Sector 44C","Sector 44D","sector 45","Sector 45A","Sector 45A","Sector 45B","Sector 45C","Sector 45D","Sector 46","Sector 46C","Sector 47","Sector 47C","Sector 47D","Sector 48","Sector 49","Sector 49A","Sector 5","Sector 50","Sector 6","Sector 61","Sector 65","Sector 7","Sector 70","Sector 7C","Sector 8","Sector 8A","Sector 8B","Sector 8C","Sector 9","Sector 9C","Sector 9D","Sector17"]}
            ]
        }
    ]
    var upperCaseNames = $scope.areas.map(function(value) {
        return value.toUpperCase();
      });
    $scope.dt = new Date();
    $scope.dateOptions = {
        formatYear: 'yy',
        maxDate: new Date(2020, 5, 22),
        minDate: new Date(),
        startingDay: 1
    };
    $scope.open1 = function () {
        $scope.popup1.opened = true;
    };
    var Api = $resource("/role1/salesParlors");
    $scope.tableParams = new NgTableParams({}, {
      getData: function(params) {
        console.log("params changed",params);
          console.log("params url",params.url())
          if(params.filter().city){
            $scope.getZones(params.filter().city);
            $scope.city=params.filter().city
          }
          if(params.filter().zone){
            params.filter().zone= params.filter().zone.replace(/%20/g," ");
            $scope.getAreas(params.filter().zone);
            $scope.zone=params.filter().zone
          }
          if(params.filter().locality){
              console.log("locality ka if")
            params.filter().locality= params.filter().locality.replace(/%20/g," ");
          }
          console.log("params changed",params.url());
        // ajax request to api
        return Api.get(params.url()).$promise.then(function(data) {    
         $scope.count=data.data.inlineCount;
        params.total(data.data.inlineCount); // recal. page nav controls
        return data.data.results;
      });
      }
    });

    $scope.dropdowns = {
        status: [{ name: '100% (closed)', value: 100 },
        { name: '90% (In closing Process)', value: 90 },
        { name: '75% (Considering)', value: 75 },
        { name: '50% (May be later)', value: 50 },
        { name: '25% (Not Interested)', value: 25 },
        { name: '0% (Not Fit)', value: 0 }],
        callMeeting: ['Meeting', 'Cold Visit', 'Phone Call', 'Cold Calling']
    }
    $scope.getSalesPersons = function () {
        $http.get('/role1/salsePerson').success(function (res) {
            console.log(res);
            $scope.salesPersons = angular.copy(res.data.map(function (response) { return { name: response.firstName, personId: response._id } }));
        })
    }
    $scope.salonDetails = {};
    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };
    $scope.apply = function (data) {
        console.log("data", data);
        var finalData = [];
        var address='';
        var address2='';
        var galatAreas=[]
        data.forEach(function (element1) {
            var element = element1[0].split(',');
            var position=element[9].indexOf(element[11]);
            if(position>-1){
                address=element[9].substring(0,position);
                address2=element[9].substring(position);
            }else{
                address=element[9];
            }if(upperCaseNames.indexOf(element[11].toUpperCase())>-1){
                finalData.push({ 
                    currentStatus :element[0], 
                    name :element[1], 
                    ownerName :element[2], 
                    landLineNo :element[3], 
                    ownerMobileNo :element[4], 
                    whatsAppNumber:element[5],
                    managerName :element[6], 
                    managerPhoneNumber :element[7], 
                    emailId :element[8], 
                    address :address, 
                    address2 :address2, 
                    city :element[12], 
                    zone :element[10], 
                    locality :element[11],                     
                })
            }else{
                galatAreas.push(element1)
            }
           

        }, this);
        console.log("final data", finalData,galatAreas);
        $http.post('/role1/createMultipleSalesParlor', { salons: finalData }).success(function (response) {
            alert("Updated Successfully")
        })

    }
    $scope.salons = [{ "name": "Test" }]
    $scope.showSalon = function () { }
    $scope.ticketData = {}
    $scope.ticketModal = function (m) {
        $scope.parlorId=m;
        $('#addTicket').modal('show');
        $scope.temp = { date: new Date(), parlorId: m };

    }



    $scope.addTicket = function (m) {

        $("#myModal").modal();
    }

    $scope.addTicketNow = function () {
         console.log($scope.temp);
         $scope.temp.parlorId=$scope.parlorId
         console.log("next",$scope.temp);
        $http.post('/role1/salesTicketByParlor', $scope.temp)
            .success(function (res) {
                $('#addTicket').modal('hide');
                console.log(res)
            })
    }

    $scope.new = function () { console.log("this fuction"); $("#newmodel").modal() }
    $scope.addSalonButton = function () { $scope.salonDetails = {}; $('#addSalon').modal('show'); }
    $scope.getSalons = function () {
        $http.get('role1/salesParlors').success(function (res) {
             console.log("salons",res)

            $scope.salons = angular.copy(res.data);

        })
    }

    $scope.getSalons();
    $scope.getSalesPersons();

    $scope.navigate = function (a) {
        if (!a) {

            var params = { params: {} };
            $state.go('dashboard.SalonManage', { param: 'nothing' });

        }
        else {

        }
    }
    $scope.editSalon = function (a) {
         console.log(a);
        $state.go('dashboard.SalonManage', { param: JSON.stringify(a) });
    }
    $scope.getCities=function (city){
        console.log("matched",city)
        return [{id:"Banglore",title:"Banglore"},
        {id:"New Delhi",title:"New Delhi"},
        {id:"Gurgaon",title:"Gurgaon"},
        {id:"Faridabad",title:"Faridabad"},
        {id:"Noida",title:"Noida"},
        {id:"Greater Noida",title:"Greater Noida"},
        {id:"Ghaziabad",title:"Ghaziabad"},
        {id:"Pune",title:"Pune"},{id:"Chandigarh",title:"Chandigarh"}]
    }
    $scope.getZones=function(city){
        var zones=[];
        $scope.locations.forEach(function(element) {
            if(element.city==city){
                console.log("matched",city);
                element.zones.forEach(function(element1) {
                    zones.push({id:element1.zoneName,title:element1.zoneName})
                }, this);
            }
        }, this);

            $scope.getZonesValues.resolve(zones);
            console.log("apply called ",$scope.getZonesValues);

       
    }
    $scope.getAreas=function(zone){
        var areas=[]
        $scope.locations.forEach(function(element) {
            if(element.city==$scope.city){
                console.log("matched",$scope.city);
                element.zones.forEach(function(element1) {
                    if(element1.zoneName==zone){
                        console.log("matched",zone);
                        element1.areas.forEach(function(a){
                            areas.push({id:a,title:a})
                        })
                    }
                    
                }, this);
            }
        }, this);
            $scope.getAreasValues.resolve(areas);

    }
});
