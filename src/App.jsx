import React, { useState, useEffect, useMemo } from 'react';
import { 
  Clock, Calendar as CalendarIcon, FileText, Users, 
  Settings, LogOut, Download, Printer, CheckCircle, 
  XCircle, AlertCircle, UserCheck, Activity, KeyRound, Mail
} from 'lucide-react';

// --- UTILITY UNTUK PARSING DATA CSV ---
// Data dipisahkan menggunakan pipe "|" untuk menghindari masalah koma pada nama/gelar.
const rawCSVData = `1|Moh.Rifani, S.Hut|Kepala Dinas|197208251997031004|260386|fannykoetai72@gmail.com||
2|Moh.Rifani, S.Hut|Sekretaris|197208251997031004|242009|fannykoetai72@gmail.com|Sekretariat|
3|Ahsun Inayati, SP, MP|Pelaksana PNS|197912162005012022|499391|ahsuninayati@kutaikartanegarakab.go.id|Sekretariat|
4|Zaiminar Rusnani, SE, M.Si|Pelaksana PNS|197412202003122006|286322|zaiminar@gmail.com|Sekretariat|
5|Achmad Akbar, S.Sos, M.Si|Pelaksana PNS|198307012009021001|556922|punyaakbar409@gmail.com|Sekretariat|
6|E.Achmad Gozali, SP|Admin|198209212010011021|549156|e.achmadgozali@yahoo.co.id|Sekretariat|
7|Emmy Aryani, SE|Pelaksana PNS|197411192008012011|397185|emmydayang18@gmail.com|Sekretariat|
8|Ida Yuspa Sari, SP|Pelaksana PNS|197705312009022001|469202|yuspasariida@gmail.com|Sekretariat|
9|Iwan Priansyah, SP|Pelaksana PNS|198309272010011013|429960|priansyahiwan@gmail.com|Sekretariat|
10|John Laurens Barus, SE|Pelaksana PNS|197609012011011001|129884|johnbarusse@gmail.com|Sekretariat|
11|Nikmah, SP|Pelaksana PNS|196910162008012019|174644|nikmahsp66@gmail.com|Sekretariat|
12|Zulkifli, SE|Pelaksana PNS|197307022007011032|385401|zulkifli.hl73@gmail.com|Sekretariat|
13|Erwina Sari, S.Sos|Pelaksana PNS|197910142008012018|274093|erwinasari720@gmail.com|Sekretariat|
14|Awang Faisyal Rachman, S,Sos, M.Si|Admin|197909152014031001|430017|awangfaisal@gmail.com|Sekretariat|
15|Akhmad Syaifuddin Nor, SP|Admin|197502172006041008|399415|udhin75@gmail.com|Sekretariat|
16|Jamilah, SE|Pelaksana PNS|197604152008012027|169901|jamilahsasa15@gmail.com|Sekretariat|
17|M. Robyansyah, S.Sos|Pelaksana PNS|197701012007011028|150471|robyansah9090@gmail.com|Sekretariat|
18|Ninik Riyanti, SP|Pelaksana PNS|198011242007012008|332672|riyantininik@yahoo.com|Sekretariat|
19|Rina Ariani, SP|Pelaksana PNS|197905062007012021|568934|rina.kanaya1979@gmail.com|Sekretariat|
20|Risa Widiawati Safitri, S.Sos|Pelaksana PNS|198202072008012015|319357|Risawidiyasari@gmail.com|Sekretariat|
21|A.Juliansyah|Admin|198107142007011010|578346|a.juliansyah1981@gmail.com|Sekretariat|
22|Iwan Supriadi|Pelaksana PNS|197904042010011023|483730|naysa.iwan@gmail.com|Sekretariat|
23|Nani Rohanah|Pelaksana PNS|197212092008012011|572717|nanirohanah1972@gmail.com|Sekretariat|
24|Susy Aryani|Pelaksana PNS|197110262001122003|467783|arianisusy435@gmail.com|Sekretariat|
25|Tamerlan Mardiana|Pelaksana PNS|197710252007012024|259231|sifauzan01@gmail.com|Sekretariat|
26|Abdul Gapur|Pelaksana PNS|198312292010011005|439201|abdulgafur083@gmail.com|Sekretariat|
27|Joko Suprayitno|Pelaksana PNS|198011102010011025|303766|suprayitnojoko7@gmail.com|Sekretariat|
28|Hendro Prawoto, S.P|Pelaksana PPPK|198310122025211022|501298|prawoto_h@yahoo.co.id|Sekretariat|
29|Nur Hafijah, S.P|Pelaksana PPPK|199101172025212031|170702|rahmanmuthia937@gmail.com|Sekretariat|
30|Dinna Yulinda, S.T.P|Pelaksana PPPK|199507172025212069|127251|dinnayulinda00@gmail.com|Sekretariat|
31|Makkamadin Aras Nai, SH, MH|Pelaksana PPPK|198008172025211123|159605|arasnai.sh.mh@gmail.com|Sekretariat|
32|Aji Faisal Hasan|Admin|198208292025211019|464648|faisal190819@gmail.com|Sekretariat|
33|Emy Latifah|Pelaksana PPPK|199510102025212038|139063|emiegirl843@gmail.com|Sekretariat|
34|Yuni Yarni|Pelaksana PPPK|197406222025212008|139817|yhunie7473@gmail.com|Sekretariat|
35|Ika Purwanto|Pelaksana PPPK|198105252025211046|393734|ekapurwanto2505@gmail.com|Sekretariat|
36|Erlita Sari|Pelaksana PPPK|199303042025212047|317639|erlitas019@gmail.com|Sekretariat|
37|Zeth Rerung|Pelaksana PPPK|199309062025211061|322918|zethrerung@gmail.com|Sekretariat|
38|Siti Muhani|Pelaksana PPPK|196808122025212005|316894|sitimuhani1968@gmail.com|Sekretariat|
39|Agus Yulianto|Pelaksana PPPK|199408172025211101|598743|agusdesitgr123@gmail.com|Sekretariat|
40|Edwin Syahruni|Pelaksana PPPK|197406132025211026|381126|edwinsyahruni@gmail.com|Sekretariat|
41|Rudi Afriandi, SP|Kasubag Umtal|197704192008011015|592190|rudinoynay@gmail.com|Sekretariat|Umum dan Tata Laksana
42|Fitri Susilawaty, S.Sos|Pelaksana PNS|197510022003122004|474129|mbakfitri8822@gmail.com|Sekretariat|Umum dan Tata Laksana
43|Henny Herawaty, SP|Pelaksana PNS|197706152008012031|190649|hennyherawaty31@gmail.com|Sekretariat|Umum dan Tata Laksana
44|Ita Purnamasari, SP|Pelaksana PNS|198410292006042010|595346|ita83862@gmail.com|Sekretariat|Umum dan Tata Laksana
45|A.Jirzi Zaidhan|Pelaksana PNS|197501072007011025|201199|tempudew2009@gmail.com|Sekretariat|Umum dan Tata Laksana
46|Darhayani|Pelaksana PNS|197510212007012021|253128|yanidarha@gmail.com|Sekretariat|Umum dan Tata Laksana
47|Harun Alrasyid|Pelaksana PNS|197411212007011015|464758|alfa.21ha@gmail.com|Sekretariat|Umum dan Tata Laksana
48|Idlin Fitriani|Pelaksana PNS|198010052007012025|223900|auliahakiem@gmail.com|Sekretariat|Umum dan Tata Laksana
49|Jasnah Handayani|Pelaksana PNS|197008172007012036|476423|jasnahhandayani@gmail.com|Sekretariat|Umum dan Tata Laksana
50|Taupiqqurahim|Pelaksana PNS|196903272007011021|482188|disnak27@gmail.com|Sekretariat|Umum dan Tata Laksana
51|Tursino Hadi|Pelaksana PNS|198206042008011017|147925|tursinohartati@gmail.com|Sekretariat|Umum dan Tata Laksana
52|Widayati|Pelaksana PNS|196805152007012063|428924|widayatiw94@gmail.com|Sekretariat|Umum dan Tata Laksana
53|Fahim Panartion|Pelaksana PNS|198407062010011025|195559|fahiempland07@gmail.com|Sekretariat|Umum dan Tata Laksana
54|Kastam|Pelaksana PNS|196906142007011041|510971|kastam1406@gmail.com|Sekretariat|Umum dan Tata Laksana
55|Tria Ahmadi, SE|Pelaksana PPPK|199007262025211029|590190|ahmadi.tria@gmail.com|Sekretariat|Umum dan Tata Laksana
56|Saiful Arif, S.Sos|Pelaksana PPPK|198312142025211018|221665|ariefiful14@gmail.com|Sekretariat|Umum dan Tata Laksana
57|Rima Rusmala Dewi, S.P|Pelaksana PPPK|198112272025212016|427792|rimarusmaladewi@gmail.com|Sekretariat|Umum dan Tata Laksana
58|Nurul Istiqomah, SE|Pelaksana PPPK|199507052025212030|133588|nurulisti.kokom@gmail.com|Sekretariat|Umum dan Tata Laksana
59|M.Abu Bakar, S.Sos|Pelaksana PPPK|198811172025211020|430811|abu.milano17@gmail.com|Sekretariat|Umum dan Tata Laksana
60|Asmida Nur Santi, S.E|Pelaksana PPPK|198803072025212029|481898|midacute0202@gmail.com|Sekretariat|Umum dan Tata Laksana
61|Budi Arfiandi, S.Sos|Pelaksana PPPK|198903292025211022|336607|budiarfiandi@gmail.com|Sekretariat|Umum dan Tata Laksana
62|Dewi Sriyastini, S.P|Admin|198109062025212013|300649|arsyilaadrenna14@gmail.com|Sekretariat|Umum dan Tata Laksana
63|Ery Setiawan, SE|Pelaksana PPPK|199305222025211015|216493|erysetiawan22@gmail.com|Sekretariat|Umum dan Tata Laksana
64|Fabian Weda Ningrum, SE|Pelaksana PPPK|199106052025212040|340494|fabianweda@gmail.com|Sekretariat|Umum dan Tata Laksana
65|Henky Firmansyah, S.Sos|Pelaksana PPPK|198510252025211031|211070|henkyfirmansyah251085@gmail.com|Sekretariat|Umum dan Tata Laksana
66|Ellyana|Pelaksana PPPK|196811212025212001|533333|aellyana66@gmail.com|Sekretariat|Umum dan Tata Laksana
67|Hirma Juni Arsa|Pelaksana PPPK|198506192025212020|250952|arsahirmajuni@gmail.com|Sekretariat|Umum dan Tata Laksana
68|Joko Prawono|Pelaksana PPPK|197901032025211017|278332|jokopranowo022@gmail.com|Sekretariat|Umum dan Tata Laksana
69|Kusbandi Dwi Suripto|Pelaksana PPPK|198402162025211021|123478|akusbandi4@gmail.com|Sekretariat|Umum dan Tata Laksana
70|Muhammad Hendra Dwi Putra|Pelaksana PPPK|200104242025211006|141994|hendradwiputra121@gmail.com|Sekretariat|Umum dan Tata Laksana
71|Rahmat Nur Ibrahim|Pelaksana PPPK|198609292025211030|523535|rahmatnuribrahim1@gmail.com|Sekretariat|Umum dan Tata Laksana
72|Ronny Wijaya|Pelaksana PPPK|199107292025211030|498330|romafatan@gmail.com|Sekretariat|Umum dan Tata Laksana
73|Selvina Rahmadani|Pelaksana PPPK|200012152025212008|355906|vinarahmadani801@gmail.com|Sekretariat|Umum dan Tata Laksana
74|Widiyawati|Pelaksana PPPK|197511112025212011|289962|wdyawati1175@gmail.com|Sekretariat|Umum dan Tata Laksana
75|Wira Nur Supriadi|Pelaksana PPPK|200112042025211006|307084|wiranur52@gmail.com|Sekretariat|Umum dan Tata Laksana
76|Muhammad Zulfan Arhanda|Pelaksana PPPK|200102022025211009|249687|Muhammadzulfanarhanda@gmail.com|Sekretariat|Umum dan Tata Laksana
77|Iqtishor Saphari|Pelaksana PPPK|198311112025211039|519037|saphariiqtishor@gmail.com|Sekretariat|Umum dan Tata Laksana
78|Muhammad Gazali|Pelaksana PPPK|197609062025211024|374290|jalikutai@gmail.com|Sekretariat|Umum dan Tata Laksana
79|Abdul Mutalib|Pelaksana PPPK|198308232025211043|570498|abdulmutalib0203@gmail.com|Sekretariat|Umum dan Tata Laksana
80|Sri Hartati|Pelaksana PPPK|197208052025212014|570114|yatinurya58@gmail.com|Sekretariat|Umum dan Tata Laksana
81|Rachmat Hidayat|Pelaksana PPPK|198602092025211035|299630|muhamadraffafadillah56@gmail.com|Sekretariat|Umum dan Tata Laksana
82|Aji Muhammad Ridho Ihsan|Pelaksana PPPK|199810272025211045|151990|ajiridhoihsan@gmail.com|Sekretariat|Umum dan Tata Laksana
83|M.Nazyarudin Miar, ST|Kepala Bidang|197401012007011065|309369|muhammadnazyarudin@gmail.com|Bidang Prasarana dan Sarana Pertanian|
84|H. Yayan Fazli, SP, MP|Pelaksana PNS|197401092000121003|482622|yanfaz33@gmail.com|Bidang Prasarana dan Sarana Pertanian|
85|Agus Suwarno, SP|Pelaksana PNS|197506192008011009|548062|agusssuwarno@gmail.com|Bidang Prasarana dan Sarana Pertanian|
86|Edy Saputra, SP|Pelaksana PNS|197202011994021001|475581|edsablok@gmail.com|Bidang Prasarana dan Sarana Pertanian|
87|Henny Agustinah, SP|Pelaksana PNS|197408282010012004|591993|hennyagustina47@gmail.com|Bidang Prasarana dan Sarana Pertanian|
88|Indah Meiliawati, SP|Pelaksana PNS|197705022007012047|456551|indahmeiliawaty@gmail.com|Bidang Prasarana dan Sarana Pertanian|
89|Irwansyah, SP|Pelaksana PNS|197206082010011011|548908|irwansyahloakulu@gmail.com|Bidang Prasarana dan Sarana Pertanian|
90|Mahda Fitriayani, SP|Pelaksana PNS|196906142008012021|199258|mahdafitriani679@gmail.com|Bidang Prasarana dan Sarana Pertanian|
91|Nurul Wardani, SP|Pelaksana PNS|197702082010012015|158295|trisnowidiyo@gmail.com|Bidang Prasarana dan Sarana Pertanian|
92|Rina Andriani, SP|Pelaksana PNS|197905112010012017|404894|rinaandriani351@gmail.com|Bidang Prasarana dan Sarana Pertanian|
93|Rini Widyastuti, SP|Pelaksana PNS|197303182010012001|514603|riniwidyastuti1973@gmail.com|Bidang Prasarana dan Sarana Pertanian|
94|Suriyadi Aswad, SP|Pelaksana PNS|197608162008011034|127048|suriyadi.aswad@gmail.com|Bidang Prasarana dan Sarana Pertanian|
95|Sutarno, SP|Pelaksana PNS|197705272010011005|161140|sutarnopertanian77@gmail.com|Bidang Prasarana dan Sarana Pertanian|
96|Usman, SP|Pelaksana PNS|197209112008011017|217122|uSMANazis72@gmail.com|Bidang Prasarana dan Sarana Pertanian|
97|Weni Triana, S.Sos|Pelaksana PNS|197503202000122003|323796|wennytriana20@gmail.com|Bidang Prasarana dan Sarana Pertanian|
98|Sofyansyah A, SP|Pelaksana PNS|197307022000121004|148774|temberaw@gmail.com|Bidang Prasarana dan Sarana Pertanian|
99|Musfi Hardani, S.Sos|Pelaksana PNS|197203282001122001|221569|musfihardani72@gmail.com|Bidang Prasarana dan Sarana Pertanian|
100|Budi Hartono, S.Sos|Pelaksana PNS|197407102007011029|327830|budihartonos.sos@gmail.com|Bidang Prasarana dan Sarana Pertanian|
101|Edi Suseno, S.Pkp|Pelaksana PNS|197302082007011028|489358|esuseno0802@gmail.com|Bidang Prasarana dan Sarana Pertanian|
102|Saipul Anwar, S.Sos|Pelaksana PNS|197103202006041015|407448|saipulanwarpertanian71@gmail.com|Bidang Prasarana dan Sarana Pertanian|
103|Alfian Hadi, A.Md|Pelaksana PNS|198107242008011011|467327|ppkloajanankukar@gmail.com|Bidang Prasarana dan Sarana Pertanian|
104|Aji Akhmad Sofian Nur Adinata K|Pelaksana PNS|198011302009011003|231132|ovie_sta@yahoo.co.id|Bidang Prasarana dan Sarana Pertanian|
105|Burahmat|Pelaksana PNS|197208082008011021|446865|burahmatrahmat@gmail.com|Bidang Prasarana dan Sarana Pertanian|
106|Mohamad Amin|Pelaksana PNS|198002202007011018|316726|20amin021980@gmail.com|Bidang Prasarana dan Sarana Pertanian|
107|Muhamad Nasir|Pelaksana PNS|198512052010011010|174311|muhamadmasput85@gmail.com|Bidang Prasarana dan Sarana Pertanian|
108|Nurhamdi|Pelaksana PNS|197208122010011003|459805|nurhamdibacok@gmail.com|Bidang Prasarana dan Sarana Pertanian|
109|Ria Rosalin|Pelaksana PNS|198206062007012017|517428|riaonly82@gmail.com|Bidang Prasarana dan Sarana Pertanian|
110|Rusdaniah|Pelaksana PNS|198111172009022003|495164|awanggylang10503@gmail.com|Bidang Prasarana dan Sarana Pertanian|
111|Sapri Murianto|Pelaksana PNS|197601032007011016|263901|muriantosupri@gmail.com|Bidang Prasarana dan Sarana Pertanian|
112|Syafriansyah Rahman|Pelaksana PNS|197602052007011010|496531|gudel52@yahoo.com|Bidang Prasarana dan Sarana Pertanian|
113|Hadiansyah|Pelaksana PNS|197503012007011024|535366|hadiansyahmuntai@gmail.com|Bidang Prasarana dan Sarana Pertanian|
114|Amiruddin|Pelaksana PNS|198003152010011026|241646|amirhmad1980@gmail.com|Bidang Prasarana dan Sarana Pertanian|
115|Adi Rahmadi, S.P|Pelaksana PPPK|198508312025211026|348300|aditambakrel121212@gmail.com|Bidang Prasarana dan Sarana Pertanian|
116|Agus Pratikno, S.P|Pelaksana PPPK|198808172025211054|526829|aguspratikno1988@gmail.com|Bidang Prasarana dan Sarana Pertanian|
117|Asep Widianto, S.P|Pelaksana PPPK|199310062025211030|229979|asepwidianto45@gmail.com|Bidang Prasarana dan Sarana Pertanian|
118|Didik Suhardiman, S.P|Pelaksana PPPK|198910252025211029|495643|sindonesia299@gmail.com|Bidang Prasarana dan Sarana Pertanian|
119|Dio Subyakto Pratama, S.P|Pelaksana PPPK|199702252025211017|184888|pratamadio62@gmail.com|Bidang Prasarana dan Sarana Pertanian|
120|Hendra Saputera, S.P|Pelaksana PPPK|198504232025211028|104031|hnra19@gmail.com|Bidang Prasarana dan Sarana Pertanian|
121|Herliyansyah, S.P|Pelaksana PPPK|197206062025211019|438802|herlyibrahim66@gmail.com|Bidang Prasarana dan Sarana Pertanian|
122|Nani Kumala Sari, S.P|Pelaksana PPPK|198504122025212023|557657|nanikumalasari51@gmail.com|Bidang Prasarana dan Sarana Pertanian|
123|Rusdiana, S.P|Pelaksana PPPK|198512302025212022|590713|dinaqoori@gmail.com|Bidang Prasarana dan Sarana Pertanian|
124|Sri Handayani, S.P|Pelaksana PPPK|198111272025212011|331007|srihan271181@gmail.com|Bidang Prasarana dan Sarana Pertanian|
125|Urbanus Paering, S.TP|Pelaksana PPPK|197907292025211010|116615|paeringinkado@gmail.com|Bidang Prasarana dan Sarana Pertanian|
126|Yogy Dewantana, S.TP|Pelaksana PPPK|199005112025211029|402550|yogydewantana@gmail.com|Bidang Prasarana dan Sarana Pertanian|
127|Pitri Anggawati, S.P|Pelaksana PPPK|199004302025212041|473674|pitriangga403@gmail.com|Bidang Prasarana dan Sarana Pertanian|
128|Melliawati|Pelaksana PPPK|197802152025212022|558354|zl3588663@gmail.com|Bidang Prasarana dan Sarana Pertanian|
129|Norma Rusmita|Pelaksana PPPK|198810222025212054|545676|mitabayu32@gmail.com|Bidang Prasarana dan Sarana Pertanian|
130|Heru Prabowo|Pelaksana PPPK|199104032025211046|426473|heruprabowo91@gmail.com|Bidang Prasarana dan Sarana Pertanian|
131|Ferri Pratama|Pelaksana PPPK|199509282025211041|463574|fpratama616@gmail.com|Bidang Prasarana dan Sarana Pertanian|
132|Hasanudin|Pelaksana PPPK|197806172025211056|517960|hasanudinn0321@gmail.com|Bidang Prasarana dan Sarana Pertanian|
133|M.Farid, SP|Kepala Bidang|197803072010011008|594127|faridzaid7@gmail.com|Bidang Tanaman Pangan dan Hortikultura|
134|Taufik, SP|Pelaksana PNS|197411041999031006|294235|taufik_jamaah@yahoo.co.id|Bidang Tanaman Pangan dan Hortikultura|
135|Akhmad Riza Ramandha, SP|Pelaksana PNS|197606092008011019|380680|riza33@ymail.com|Bidang Tanaman Pangan dan Hortikultura|
136|Eli Yanasusanti, S.Sos|Pelaksana PNS|198012032000122002|194600|eliyanasusanti03@gmail.com|Bidang Tanaman Pangan dan Hortikultura|
137|Ely Nuryanti, SP|Pelaksana PNS|197707212008012013|579290|elyanti2177@gmail.com|Bidang Tanaman Pangan dan Hortikultura|
138|Leliana, SP|Pelaksana PNS|197311212008012010|390383|lelisofian17@gmail.com|Bidang Tanaman Pangan dan Hortikultura|
139|Nurodin, SP|Pelaksana PNS|197103102007011034|244364|norodin1971@gmail.com|Bidang Tanaman Pangan dan Hortikultura|
140|Sudarwati, SP, M.Si|Pelaksana PNS|197906032010012019|323358|chachaarmicha@gmail.com|Bidang Tanaman Pangan dan Hortikultura|
141|Titin Damayanti, SP|Pelaksana PNS|197802262008012016|554622|titindamayanti23@gmail.com|Bidang Tanaman Pangan dan Hortikultura|
142|Kus Endang Junaidy, S.Hut|Pelaksana PNS|197903082008011025|390377|kustgr83@gmail.com|Bidang Tanaman Pangan dan Hortikultura|
143|Aji Roy Winata, SE|Pelaksana PNS|197703112007011016|499311|bintangirawan3@gmail.com|Bidang Tanaman Pangan dan Hortikultura|
144|Haryono, SP|Pelaksana PNS|197308012007011031|398967|nonokmaha@gmail.com|Bidang Tanaman Pangan dan Hortikultura|
145|Joko Supadmo, S.Pkp|Pelaksana PNS|197705122008011034|557778|jokosupadmoupttgr@gmail.com|Bidang Tanaman Pangan dan Hortikultura|
146|Juliana Astuti, SP|Pelaksana PNS|197707142007012034|123982|julianaastuti147@gmail.com|Bidang Tanaman Pangan dan Hortikultura|
147|Muhammad Anton Yusva, SP|Pelaksana PNS|197903302007011007|135445|antoniqbal57@gmail.com|Bidang Tanaman Pangan dan Hortikultura|
148|Nor Asikin, SP|Pelaksana PNS|197210122008012015|418141|ummynya.yaya@gmail.com|Bidang Tanaman Pangan dan Hortikultura|
149|Muhamad Agus, S.Sos|Pelaksana PNS|197508242009021001|454626|subrantas78@gmail.com|Bidang Tanaman Pangan dan Hortikultura|
150|Supriyatno, SE|Pelaksana PNS|198204042009021008|195579|soepridistan@yahoo.co.id|Bidang Tanaman Pangan dan Hortikultura|
151|M.Johansyah, SE|Pelaksana PNS|197902172008011018|283563|tujof79@gmail.com|Bidang Tanaman Pangan dan Hortikultura|
152|Yudhi Hermawan, A.Md|Pelaksana PNS|197703102008011018|324112|yudisorang@yahoo.com|Bidang Tanaman Pangan dan Hortikultura|
153|Akhmad Rizali, A.Md|Pelaksana PNS|198107052008011023|557358|akhmad.rizal81@gmail.com|Bidang Tanaman Pangan dan Hortikultura|
154|Erni Fithriani|Pelaksana PNS|198011292009012001|268979|ericselyn@gmail.com|Bidang Tanaman Pangan dan Hortikultura|
155|Erniwati|Pelaksana PNS|197501232000122002|443546|ernijannah75123@gmail.com|Bidang Tanaman Pangan dan Hortikultura|
156|Junaidi|Pelaksana PNS|197309052007011025|123144|maseddijun@gmail.com|Bidang Tanaman Pangan dan Hortikultura|
157|Mulyani|Pelaksana PNS|198001152008012012|458963|mulyanimelany59@gmail.com|Bidang Tanaman Pangan dan Hortikultura|
158|Rimayana|Pelaksana PNS|196810112007012023|539192|Rimayana68@gmail.com|Bidang Tanaman Pangan dan Hortikultura|
159|Sarah Ratna Afianti|Pelaksana PNS|198111172007012012|551025|sarahratnaafianti@gmail.com|Bidang Tanaman Pangan dan Hortikultura|
160|Syahrudin|Pelaksana PNS|197603012010011010|502779|rudinsyah599@gmail.com|Bidang Tanaman Pangan dan Hortikultura|
161|Syarifuddin|Pelaksana PNS|197407152008011021|144939|syarifuddinbp3k74@gmail.com|Bidang Tanaman Pangan dan Hortikultura|
162|Zakaria|Pelaksana PNS|197809172010011011|460739|zakazakaria1978@gmail.com|Bidang Tanaman Pangan dan Hortikultura|
163|Ahmad Muslim, S.P|Pelaksana PPPK|198808132025211021|225005|ahmadmusliem678@gmail.com|Bidang Tanaman Pangan dan Hortikultura|
164|Dila Risdiani, S.Sos|Pelaksana PPPK|198802072025212020|114091|dilarisdiani@gmail.com|Bidang Tanaman Pangan dan Hortikultura|
165|Dwy Eka Maharani, S.P|Pelaksana PPPK|198211212025212015|591317|dwymaharani32@gmail.com|Bidang Tanaman Pangan dan Hortikultura|
166|Efri Januari, S.P|Pelaksana PPPK|198401222025211011|458179|efri.kutai@gmail.com|Bidang Tanaman Pangan dan Hortikultura|
167|Elisa Fitriani, S.Sos|Pelaksana PPPK|199104162025212032|111179|elisafitriani1635@gmail.com|Bidang Tanaman Pangan dan Hortikultura|
168|Emelda Riska Susanti, S.P|Pelaksana PPPK|198202232025212016|311515|emeldariska858@gmail.com|Bidang Tanaman Pangan dan Hortikultura|
169|Eny Fitriany, S.Sos|Pelaksana PPPK|198710162025212022|572512|enychemot@gmail.com|Bidang Tanaman Pangan dan Hortikultura|
170|Ervian Haribudiman, S.Sos|Pelaksana PPPK|199312222025211022|599506|empivv@gmail.com|Bidang Tanaman Pangan dan Hortikultura|
171|Fitriansyah, S.Sos|Pelaksana PPPK|198805152025211054|323628|fitriansyah88889@gmail.com|Bidang Tanaman Pangan dan Hortikultura|
172|Hendro Winarto, S.P|Pelaksana PPPK|198403152025211030|296389|winartohendro94@gmail.com|Bidang Tanaman Pangan dan Hortikultura|
173|Iva Yanti, S.P|Pelaksana PPPK|197902212025212007|292536|ivayanti711@gmail.com|Bidang Tanaman Pangan dan Hortikultura|
174|Lalu Muhamad Syukur, S.P|Pelaksana PPPK|198311092025211020|263835|muhamadsyukur038@gmail.com|Bidang Tanaman Pangan dan Hortikultura|
175|Mochammad Zainuri Ikhwan, S.P|Pelaksana PPPK|199202132025211026|123714|zainuri92@gmail.com|Bidang Tanaman Pangan dan Hortikultura|
176|Muhammad Fazri Azhari, S.P|Pelaksana PPPK|198311182025211012|113348|azhynezious@gmail.com|Bidang Tanaman Pangan dan Hortikultura|
177|Rachmad Afandi, S.P|Pelaksana PPPK|197909032025211022|128491|fendi100pemt@gmail.com|Bidang Tanaman Pangan dan Hortikultura|
178|Suprapti, S.P|Pelaksana PPPK|198306102025212026|417073|praptiherwiwin@gmail.com|Bidang Tanaman Pangan dan Hortikultura|
179|Susanto Hadi Prastyoningtias, S.P|Pelaksana PPPK|198204262025211011|289688|prastyoningtias@gmail.com|Bidang Tanaman Pangan dan Hortikultura|
180|Aji Theresia Bariah|Pelaksana PPPK|197104262025212005|387614|ajitheresia@gmail.com|Bidang Tanaman Pangan dan Hortikultura|
181|Melda Maya Sari|Pelaksana PPPK|199408052025212068|142958|mayasariamel52@gmail.com|Bidang Tanaman Pangan dan Hortikultura|
182|Ayu Ditha Pratiwi|Pelaksana PPPK|198609092025212060|505607|ditharaskey86@gmail.com|Bidang Tanaman Pangan dan Hortikultura|
183|Ika Mardiana Astuti|Pelaksana PPPK|198609232025212037|486671|madam_ikacantik@yahoo.co.id|Bidang Tanaman Pangan dan Hortikultura|
184|Zainab|Pelaksana PPPK|197005132025212004|233179|zainabdistanak@gmail.com|Bidang Tanaman Pangan dan Hortikultura|
185|Muhammad Andra Ariadi|Pelaksana PPPK|200206222025211006|172145|Andra.ariadi32@gmail.com|Bidang Tanaman Pangan dan Hortikultura|
186|Dayang Siti Selsilawati Agustina|Pelaksana PPPK|199708162025212086|453100|dayangtina16@gmail.com|Bidang Tanaman Pangan dan Hortikultura|
187|Erwin Suryawirawan, SP|Kepala Bidang|197701312008011012|170999|erwinsuryaw@yahoo.com|Bidang Usaha dan Penyuluhan|
188|Hendra Budianoor, SP|Pelaksana PNS|198101272001121003|128509|hendramerina@gmail.com|Bidang Usaha dan Penyuluhan|
189|Arizal Rakhman, SP|Pelaksana PNS|198210262009011003|596621|rizal.azm@gmail.com|Bidang Usaha dan Penyuluhan|
190|A.M. Djunaidi A, S.St|Pelaksana PNS|196903211998031004|565340|amdjunaidia@gmail.com|Bidang Usaha dan Penyuluhan|
191|Adriansyah, SP|Pelaksana PNS|197512172008011007|340086|adriansyahdistan@gmail.com|Bidang Usaha dan Penyuluhan|
192|Arbiana Sukmawati, SP|Pelaksana PNS|197512162007012016|253667|umiqori16@gmail.com|Bidang Usaha dan Penyuluhan|
193|Diana Munawwarah, SP|Pelaksana PNS|197602272001122003|537165|dianamunawwarah51@gmail.com|Bidang Usaha dan Penyuluhan|
194|Johan Syahrani, SP, M.A.P|Pelaksana PNS|198311012010011018|496280|johansyahrani1@gmail.com|Bidang Usaha dan Penyuluhan|
195|Lenni Marlina Ritonga, SP|Pelaksana PNS|197906182010012006|137893|lennimarlinaritonga@gmail.com|Bidang Usaha dan Penyuluhan|
196|Marlinna Miar, SP, M.Si|Pelaksana PNS|197109292007012021|372697|marlinnaaa299@gmail.com|Bidang Usaha dan Penyuluhan|
197|Misrani Dedy Riyanto, SP|Pelaksana PNS|197411042008011013|315831|Dedyriyanytosanga2@gmail.com|Bidang Usaha dan Penyuluhan|
198|Maryani, SE|Pelaksana PNS|197412162008012008|263713|mayaniyani94@gmail.com|Bidang Usaha dan Penyuluhan|
199|Sri Rahayu, SP|Pelaksana PNS|197910302010012003|307643|ayuanara46@gmail.com|Bidang Usaha dan Penyuluhan|
200|Asnan A, S.Sos|Pelaksana PNS|196912222000121004|102329|asnannan245@gmail.com|Bidang Usaha dan Penyuluhan|
201|Desy Susanti, S.Kom|Pelaksana PNS|198112012008012016|302778|dessy.susanti72@gmail.com|Bidang Usaha dan Penyuluhan|
202|Khrisna Yuniarti, A.Md, S.Hut|Pelaksana PNS|197806182008012025|171867|yuniartikrisna85@gmail.com|Bidang Usaha dan Penyuluhan|
203|Rahmad Haryadi, A.Md|Pelaksana PNS|198105012009021002|256689|saktiaperdanaputra@gmail.com|Bidang Usaha dan Penyuluhan|
204|Norma|Pelaksana PNS|197804222009012001|523733|normanaysa@gmail.com|Bidang Usaha dan Penyuluhan|
205|Agus Elfian Joni|Pelaksana PNS|196902112007011027|146384|joniagus437@gmail.com|Bidang Usaha dan Penyuluhan|
206|Andri|Pelaksana PNS|197407032007011029|302894|andymustaine03@gmail.com|Bidang Usaha dan Penyuluhan|
207|Badran, S.HI|Pelaksana PNS|197408072007011034|265966|hairilhairil657@gmail.com|Bidang Usaha dan Penyuluhan|
208|Fitria Yulianti|Pelaksana PNS|198107182010012004|378338|Fitria.yulianti3488@gmail.com|Bidang Usaha dan Penyuluhan|
209|Hermanto|Pelaksana PNS|197501052009061005|441548|hermantobedjo@gmail.com|Bidang Usaha dan Penyuluhan|
210|Ida Charyani|Pelaksana PNS|197201152007012025|243387|idacharyani@gmail.com|Bidang Usaha dan Penyuluhan|
211|Jamroni|Pelaksana PNS|198203162009021003|121703|jamroniarya@yahoo.com|Bidang Usaha dan Penyuluhan|
212|Lambas Sitompul|Pelaksana PNS|197003152010011004|495310|sitompullambas70@gmail.com|Bidang Usaha dan Penyuluhan|
213|Rima Afrima.A, SE|Pelaksana PNS|198604162010012028|497117|rimaafrima1986@gmail.com|Bidang Usaha dan Penyuluhan|
214|Sopyan Hadi|Pelaksana PNS|198011252007011011|477311|sopyan9999@gmail.com|Bidang Usaha dan Penyuluhan|
215|Sri Hartati|Pelaksana PNS|197606112007012019|183057|srie.yeye@gmail.com|Bidang Usaha dan Penyuluhan|
216|Sulastri|Pelaksana PNS|198302022008012024|171564|sulastriselalusetia@gmail.com|Bidang Usaha dan Penyuluhan|
217|Supriyono|Pelaksana PNS|196904022009021001|128232|brayyono6@gmail.com|Bidang Usaha dan Penyuluhan|
218|Susanto|Pelaksana PNS|197005212007011029|446980|susanto070@gmail.com|Bidang Usaha dan Penyuluhan|
219|Andi Wahyudi|Pelaksana PNS|198310022012121003|393727|andi.lulut@gmail.com|Bidang Usaha dan Penyuluhan|
220|Mursyid|Pelaksana PNS|197104172006041014|401696|ketemu98@gmail.com|Bidang Usaha dan Penyuluhan|
221|Rendi Irawan|Pelaksana PNS|198407272010011031|312692|rendy.rhere@gmail.com|Bidang Usaha dan Penyuluhan|
222|Abdullah Zauhari, S.Pd.I|Pelaksana PPPK|198909072025211027|269914|zauhariabdullah79@gmail.com|Bidang Usaha dan Penyuluhan|
223|Agus Suprianto, SE|Pelaksana PPPK|197708112025211011|196830|agussantoh78@gmail.com|Bidang Usaha dan Penyuluhan|
224|Alda Nanda Pratiwi, S.Pd|Pelaksana PPPK|199905252025212018|134435|pratiwialda25@gmail.com|Bidang Usaha dan Penyuluhan|
225|Ali Rahman, S.Pd|Pelaksana PPPK|199002022025211032|421264|alir020290@gmail.com|Bidang Usaha dan Penyuluhan|
226|Anggi Wijaya Mulawarman, SH|Pelaksana PPPK|198410032025211020|570177|anggiwijayam@gmail.com|Bidang Usaha dan Penyuluhan|
227|Eka Ramadani, S.PKP|Pelaksana PPPK|198506012025211025|451712|donimaha749@gmail.com|Bidang Usaha dan Penyuluhan|
228|Endah Mayangsari, S.P|Pelaksana PPPK|199004162025212029|438481|endahnirwana16@gmail.com|Bidang Usaha dan Penyuluhan|
229|Feby Ade Nuzuliadi, S.P|Pelaksana PPPK|199402282025211035|252526|febyadenuzuliadi@gmail.com|Bidang Usaha dan Penyuluhan|
230|Heny Rosyani, SE|Pelaksana PPPK|199110022025212032|137226|henyros16@gmail.com|Bidang Usaha dan Penyuluhan|
231|Ida Nirmala, SE|Pelaksana PPPK|196905122025212005|164334|idanirmalase@gmail.com|Bidang Usaha dan Penyuluhan|
232|Irwan, S.Ak|Pelaksana PPPK|197609292025211016|242701|ironeaz29@gmail.com|Bidang Usaha dan Penyuluhan|
233|M. Zakaria, SE|Pelaksana PPPK|198210182025211025|184377|zakalahzakaria@gmail.com|Bidang Usaha dan Penyuluhan|
234|Muhammad Musthofa Ulya, S.Pd|Pelaksana PPPK|199708012025211015|549693|musthofa69.mu@gmail.com|Bidang Usaha dan Penyuluhan|
235|Mulyadi, S.P|Pelaksana PPPK|198604082025211034|149931|mulyadimaha86@gmail.com|Bidang Usaha dan Penyuluhan|
236|Musdalipah, S.P|Pelaksana PPPK|199112042025212024|395054|muhses91@gmail.com|Bidang Usaha dan Penyuluhan|
237|Noor Baity, S.P|Pelaksana PPPK|199109222025212032|504795|betty22naya@gmail.com|Bidang Usaha dan Penyuluhan|
238|Randi Hastaria, SE|Pelaksana PPPK|198508062025211031|160816|randihastaria.se@gmail.com|Bidang Usaha dan Penyuluhan|
239|Rendi Kurniawansyah, SE|Pelaksana PPPK|198710182025211027|595290|rendycuki@gmail.com|Bidang Usaha dan Penyuluhan|
240|Suparjiono, SE|Pelaksana PPPK|197206152025211018|563708|suparjionojiono4@gmail.com|Bidang Usaha dan Penyuluhan|
241|Irma Wahyuni, S.P.|Pelaksana PPPK|198408272025212048|402512|irmapertanian@gmail.com|Bidang Usaha dan Penyuluhan|
242|Aulia Rahman, A.Md|Pelaksana PPPK|198402062025211021|466661|garox6006@gmail.com|Bidang Usaha dan Penyuluhan|
243|Rohana Tristina|Pelaksana PPPK|198707262025212032|592531|rohanatristina430@gmail.com|Bidang Usaha dan Penyuluhan|
244|Tri Handayani|Pelaksana PPPK|198105052025212031|401671|trienandhika05@gmail.com|Bidang Usaha dan Penyuluhan|
245|Hari Santiko|Pelaksana PPPK|197005132025211010|357141|harydoglas12@gmail.com|Bidang Usaha dan Penyuluhan|
246|Norsehan|Pelaksana PPPK|197703282025212014|224909|smdkaltim388@gmail.com|Bidang Usaha dan Penyuluhan|
247|Noor Santi|Pelaksana PPPK|198701212025212030|190852|noorsanti01@gmail.com|Bidang Usaha dan Penyuluhan|
248|Syafitriansyah|Pelaksana PPPK|197709172025211018|508040|tepiantebor13@gmail.com|Bidang Usaha dan Penyuluhan|
249|Herika Dianti|Pelaksana PPPK|198111292025212008|389132|herikadianty@gmail.com|Bidang Usaha dan Penyuluhan|
250|Dita Siskiani|Pelaksana PPPK|199212182025212025|427182|ditasiskiani@gmail.com|Bidang Usaha dan Penyuluhan|
251|Dwi Febriatiningsih|Pelaksana PPPK|198102182025212018|426767|ningsih27277@gmail.com|Bidang Usaha dan Penyuluhan|
252|Tri Endang Wahyuni|Pelaksana PPPK|199303022025212027|295055|tri99jaya@gmail.com|Bidang Usaha dan Penyuluhan|
253|Khairun Nisa|Pelaksana PPPK|199908162025212012|265955|khairunnisa166718@gmail.com|Bidang Usaha dan Penyuluhan|
254|Silvana Rahmawati|Pelaksana PPPK|197709062025212011|136699|rahmawatisilvana6@gmail.com|Bidang Usaha dan Penyuluhan|
255|Sri Wahyuni|Pelaksana PPPK|197701292025212003|354751|sriwahyuni290177@gmail.com|Bidang Usaha dan Penyuluhan|
256|Sugianto|Pelaksana PPPK|196908052025211010|532968|sugiantogentok372@gmail.com|Bidang Usaha dan Penyuluhan|
257|Sutarsih|Pelaksana PPPK|197401012025212005|292775|sutarsih0174@gmail.com|Bidang Usaha dan Penyuluhan|
258|Wawan Setiawan|Pelaksana PPPK|198610212025211025|265423|alkaalfaeza11234@gmail.com|Bidang Usaha dan Penyuluhan|
259|Yanti Astuti|Pelaksana PPPK|198605112025212022|424756|yantiastutie@gmail.com|Bidang Usaha dan Penyuluhan|
260|Padli|Pelaksana PPPK|197808212025211010|102640|ppadli398@gmail.com|Bidang Usaha dan Penyuluhan|
261|Sudarno|Pelaksana PPPK|198108112025211022|467442|sudarnonunok@gmail.com|Bidang Usaha dan Penyuluhan|
262|Widodo|Pelaksana PPPK|198201082025211017|118048|dodowidodo20@gmail.com|Bidang Usaha dan Penyuluhan|
263|Eva Susanti|Pelaksana PPPK|198510032025212014|483228|evasusanti12517@gmail.com|Bidang Usaha dan Penyuluhan|
264|Ida Farida|Pelaksana PPPK|197610052025212006|299543|idafaridaeggy@gmail.com|Bidang Usaha dan Penyuluhan|
265|Ida Wahyuni|Pelaksana PPPK|198110062025212009|144566|idaw6668@gmail.com|Bidang Usaha dan Penyuluhan|
266|Sofyan Nur|Pelaksana PPPK|197512202025211012|575917|sofyannur5809@gmail.com|Bidang Usaha dan Penyuluhan|
267|Zulfani Azwar|Pelaksana PPPK|198907122025211039|419700|zulfannyazwar0907@gmail.com|Bidang Usaha dan Penyuluhan|
268|Firdaus Alam Setiawan|Pelaksana PPPK|199405242025211025|361369|firdauz.alam94@gmail.com|Bidang Usaha dan Penyuluhan|
269|Hosen|Pelaksana PPPK|197708142025211014|464539|hosenety37@gmail.com|Bidang Usaha dan Penyuluhan|
270|M.Mustamin|Pelaksana PPPK|198704022025211022|325425|mustamin020487@gmail.com|Bidang Usaha dan Penyuluhan|
271|Nanang Effendi|Pelaksana PPPK|197606162025211018|429211|nanangeppendi@gmail.com|Bidang Usaha dan Penyuluhan|
272|Putra Adiatma|Pelaksana PPPK|198903092025211034|466495|Putra.adiatma79@gmail.com|Bidang Usaha dan Penyuluhan|
273|Tria Nurista Laqad K|Pelaksana PPPK|199303152025212037|506827|nuristalaqad@gmail.com|Bidang Usaha dan Penyuluhan|
274|Pajriani|Pelaksana PPPK|198404202025211039|471320|pajriani357@gmail.com|Bidang Usaha dan Penyuluhan|
275|Habiburrohman|Pelaksana PPPK|199705292025211029|369140|hburrohman7@gmail.com|Bidang Usaha dan Penyuluhan|
276|Etri Dayanti|Pelaksana PPPK|198703172025212023|400915|etridayanti17041987@gmail.com|Bidang Usaha dan Penyuluhan|
277|Heni Herawati|Pelaksana PPPK|197109012025212005|423632|heniherawati0109@gmail.com|Bidang Usaha dan Penyuluhan|
278|Nadya Febrianti Putri|Pelaksana PPPK|199702232025212015|537761|fnadya199@gmail.com|Bidang Usaha dan Penyuluhan|
279|Rusmila Mardianti|Pelaksana PPPK|198803222025212034|205619|rusmilamardianti22@gmail.com|Bidang Usaha dan Penyuluhan|
280|Mawarni|Pelaksana PPPK|198009302025212018|399258|mawarniiii.30@gmail.com|Bidang Usaha dan Penyuluhan|
281|Surahman|Pelaksana PPPK|198807072025211091|251526|surahmansn5@gmail.com|Bidang Usaha dan Penyuluhan|
282|Baniah|Pelaksana PPPK|197201162025212010|122646|baniah342@gmail.com|Bidang Usaha dan Penyuluhan|
283|Leli Chandra Repita|Pelaksana PPPK|200201012025212006|590509|LELYCHANDRA8899@GMAIL.COM|Bidang Usaha dan Penyuluhan|
284|Al Qadri|Pelaksana PPPK|197505102025211055|164459|Alqadri1005@gmail.com|Bidang Usaha dan Penyuluhan|
285|Firman Qalam Setiawan|Pelaksana PPPK|199108272025211043|288753|virmancrow91@gmail.com|Bidang Usaha dan Penyuluhan|
286|M. Noer Budi Setiawan|Pelaksana PPPK|199404042025211155|165191|budikukar4@gmail.com|Bidang Usaha dan Penyuluhan|
287|Sumi|Pelaksana PPPK|197704152025212020|257032|pertaniansumi4@gmail.com|Bidang Usaha dan Penyuluhan|
288|Aji Gazali Rahman, S.Pt, MP|Kepala Bidang|196806091991021002|375907|ajighazali234@gmail.com|Bidang Peternakan dan Kesehatan Hewan|
289|Ir. Nelva Aflinda|Pelaksana PNS|196804291998032004|527713|nelvaaflinda29@gmail.com|Bidang Peternakan dan Kesehatan Hewan|
290|Aji Zikri Zulfian, S.Pt|Pelaksana PNS|197609202006041003|466695|ajizikrizulfian2@gmail.com|Bidang Peternakan dan Kesehatan Hewan|
291|Haeruna, SP|Pelaksana PNS|196804061991021005|265324|haeruna0604@gmail.com|Bidang Peternakan dan Kesehatan Hewan|
292|Tri Widiastuti S.W, SE|Pelaksana PNS|198303262010012028|103128|acityalituhayu24@gmail.com|Bidang Peternakan dan Kesehatan Hewan|
293|Zainal Abidin, SE|Pelaksana PNS|197311212008011010|236574|bidinketupat@gmail.com|Bidang Peternakan dan Kesehatan Hewan|
294|Erau Achmad Rusianto, SE|Pelaksana PNS|197309282007011029|270715|erau.dira@gmail.com|Bidang Peternakan dan Kesehatan Hewan|
295|Sahono, S.Pkp|Pelaksana PNS|197009252000121006|289536|sahono19700@gmail.com|Bidang Peternakan dan Kesehatan Hewan|
296|Akhdalena, SE|Pelaksana PNS|197811122007012024|424078|akhdalena@gmail.com|Bidang Peternakan dan Kesehatan Hewan|
297|Eka Nursih, SP|Pelaksana PNS|197405062007012033|145766|ekanursih65@gmail.com|Bidang Peternakan dan Kesehatan Hewan|
298|Herry Gunawan, SE|Pelaksana PNS|197201062007011026|428112|hery38288@gmail.com|Bidang Peternakan dan Kesehatan Hewan|
299|Leli Mahdalena, S.Sos|Pelaksana PNS|197604122007012033|282018|lelimahdalena123@gmail.com|Bidang Peternakan dan Kesehatan Hewan|
300|Rahmawati Astuti, SM|Pelaksana PNS|197608222000122002|344739|rhmwtastuti@gmail.com|Bidang Peternakan dan Kesehatan Hewan|
301|Samsi, SE|Pelaksana PNS|197706082007011020|440432|samsi12tgr@gmail.com|Bidang Peternakan dan Kesehatan Hewan|
302|Syahmadi, S.Sos|Pelaksana PNS|197212182007011012|520408|madkkukar@gmail.com|Bidang Peternakan dan Kesehatan Hewan|
303|Tati Hariaty Fitri, SE|Pelaksana PNS|198307122008012013|429504|tatihariatyfitri@gmail.com|Bidang Peternakan dan Kesehatan Hewan|
304|Eny Diana, A.Md|Pelaksana PNS|197004142000122005|340259|enydiana274@gmail.com|Bidang Peternakan dan Kesehatan Hewan|
305|Muhammad Fuad|Pelaksana PNS|197001142000121004|582451|muhammadfuad1401@gmail.com|Bidang Peternakan dan Kesehatan Hewan|
306|Aspiansyah|Pelaksana PNS|197510292008011008|209183|julakian.75@gmail.com|Bidang Peternakan dan Kesehatan Hewan|
307|Faidil Anwar|Pelaksana PNS|197808272007011008|346554|faidil.distanak@gmail.com|Bidang Peternakan dan Kesehatan Hewan|
308|Heny Triana|Pelaksana PNS|197607252007012027|463025|heny.riana160776@gmail.com|Bidang Peternakan dan Kesehatan Hewan|
309|Husni Thamrin|Pelaksana PNS|196808162006041013|527540|thusni737@gmail.com|Bidang Peternakan dan Kesehatan Hewan|
310|Indra Budiman|Pelaksana PNS|198101282010011002|556113|indrabudimanloakulu@gmail.com|Bidang Peternakan dan Kesehatan Hewan|
311|Iwan Wahyudi|Pelaksana PNS|197803212007011010|580846|iw4309702@gmail.com|Bidang Peternakan dan Kesehatan Hewan|
312|M.Nur Alamsyah|Pelaksana PNS|198101032007011016|421945|muhammadnuralamsyah.mna@gmail.com|Bidang Peternakan dan Kesehatan Hewan|
313|Nafisah|Pelaksana PNS|197107272007012022|580948|niniknafisah27@gmail.com|Bidang Peternakan dan Kesehatan Hewan|
314|Drh. Gunawan Nanang Dwi Basuki Soewarto|Pelaksana PPPK|197111052025211012|427477|gunawannanang051171@gmail.com|Bidang Peternakan dan Kesehatan Hewan|
315|Drh. Rianty Novita Sari|Pelaksana PPPK|199606032025212025|333797|rianty.po@gmail.com|Bidang Peternakan dan Kesehatan Hewan|
316|Agustina.Mb, S.P|Pelaksana PPPK|197008172025212009|381307|agustinambsp@gmail.com|Bidang Peternakan dan Kesehatan Hewan|
317|Ahmad Efendi, SE|Pelaksana PPPK|198110072025211021|112730|ahmadoang99@gmail.com|Bidang Peternakan dan Kesehatan Hewan|
318|Delta Septi Syulliana, S.E|Pelaksana PPPK|198409182025212020|335262|deltass84@gmail.com|Bidang Peternakan dan Kesehatan Hewan|
319|Dimas Bhakti Nan Ichsani, S.Pt|Pelaksana PPPK|199501162025211014|137437|dimasbhakti16@gmail.com|Bidang Peternakan dan Kesehatan Hewan|
320|Ema Zulfianti, S.Pt|Pelaksana PPPK|199106202025212028|536133|zulfiantiema@gmail.com|Bidang Peternakan dan Kesehatan Hewan|
321|Ida Ayu Putu Sri Utami, SE|Pelaksana PPPK|198601092025212015|120486|dayusri65719@gmail.com|Bidang Peternakan dan Kesehatan Hewan|
322|Mailia Widiastuti, SP., M.Si|Pelaksana PPPK|197605262025212013|183217|maylia0kto@gmail.com|Bidang Peternakan dan Kesehatan Hewan|
323|Mochamad Hendriawan.S. S.P|Pelaksana PPPK|199102122025211034|105579|drumerudin@ymail.com|Bidang Peternakan dan Kesehatan Hewan|
324|Rosita, S.Sos|Pelaksana PPPK|198611292025212025|353290|rositaqu86@gmail.com|Bidang Peternakan dan Kesehatan Hewan|
325|Salmawati, S.Pt|Pelaksana PPPK|197610092025212012|403567|inuchamay76@gmail.com|Bidang Peternakan dan Kesehatan Hewan|
326|Suliem, S.Sos|Pelaksana PPPK|197608062025212008|278832|sulisuliem116@gmail.com|Bidang Peternakan dan Kesehatan Hewan|
327|Syartika Tristiana, S.Sos., M.H|Pelaksana PPPK|198604072025212027|113343|Syartiqamh@gmail.com|Bidang Peternakan dan Kesehatan Hewan|
328|Wawan Supriawan, S.Sos|Pelaksana PPPK|198112102025211021|492287|w4w4n101281@gmail.com|Bidang Peternakan dan Kesehatan Hewan|
329|Debora Maretha Aulia Elva Br Siahaan, S.Pt|Pelaksana PPPK|199303252025212076|260544|deboraetha0@gmail.com|Bidang Peternakan dan Kesehatan Hewan|
330|Benny Lugiarti, S.P|Pelaksana PPPK|197608132025212011|219099|bennypunya8@gmail.com|Bidang Peternakan dan Kesehatan Hewan|
331|Hariyanto Nathan, S.P|Pelaksana PPPK|198607262025211040|276665|arhienathan86@gmail.com|Bidang Peternakan dan Kesehatan Hewan|
332|Ramadana, S.P|Pelaksana PPPK|199412052025212048|325146|ramadana51294@gmail.com|Bidang Peternakan dan Kesehatan Hewan|
333|Noor Hidayah|Pelaksana PPPK|198211192025212011|125154|noorhidayah1182@gmail.com|Bidang Peternakan dan Kesehatan Hewan|
334|Wahyudhi|Pelaksana PPPK|198702262025211022|583768|farrelalrizky1987@gmail.com|Bidang Peternakan dan Kesehatan Hewan|
335|Kurniawan Adi Surya|Pelaksana PPPK|198603052025211026|154795|kuriwan150@gmail.com|Bidang Peternakan dan Kesehatan Hewan|
336|Eva Rosita|Pelaksana PPPK|200201012025212020|523336|evharosita01@gmail.com|Bidang Peternakan dan Kesehatan Hewan|
337|Hery Marsudi J, SP, MP|Kasubag TU UPT|196906012000121007|414791|herrymarsudi199@gmail.com|UPT Balai Benih Pembantu Tanaman Pangan|Tata Usaha
338|Muliani, SP|Pelaksana PNS|197611192010012015|445838|mulianizain1119@gmail.com|UPT Balai Benih Pembantu Tanaman Pangan|Tata Usaha
339|Suharyono, SP|Pelaksana PNS|197308011997031003|557670|suharyonokukar534@gmail.com|UPT Balai Benih Pembantu Tanaman Pangan|Tata Usaha
340|Astuti, S.Sos|Pelaksana PNS|197302052008012016|442536|mamakastuti73@gmail.com|UPT Balai Benih Pembantu Tanaman Pangan|Tata Usaha
341|Suharda, SP|Pelaksana PNS|197806102007012023|162602|suardasp@gmail.com|UPT Balai Benih Pembantu Tanaman Pangan|Tata Usaha
342|Rukiati, S.Pkp|Pelaksana PNS|197210122000122003|108223|rukiati1072@gmail.com|UPT Balai Benih Pembantu Tanaman Pangan|Tata Usaha
343|Indra Gunawan, SP|Pelaksana PNS|198107152008011019|394241|indrabangben81@gmail.com|UPT Balai Benih Pembantu Tanaman Pangan|Tata Usaha
344|Erie Roebiyanto, SP|Pelaksana PNS|198211022007011004|529376|erieroebiyanto@gmail.com|UPT Balai Benih Pembantu Tanaman Pangan|Tata Usaha
345|Irwansyah|Pelaksana PNS|197911092008011011|546133|irwansyah72blog@gmail.com|UPT Balai Benih Pembantu Tanaman Pangan|Tata Usaha
346|Windarti|Pelaksana PNS|198008122009022009|545431|windartislamet85@gmail.com|UPT Balai Benih Pembantu Tanaman Pangan|Tata Usaha
347|Syahroni|Pelaksana PNS|198404122010011025|367176|meteorid23@gmail.com|UPT Balai Benih Pembantu Tanaman Pangan|Tata Usaha
348|Rusniah, A,Md|Pelaksana PPPK|198111082025212016|455865|rusniah2727@gmail.com|UPT Balai Benih Pembantu Tanaman Pangan|Tata Usaha
349|Githa Puspita Sari|Pelaksana PPPK|199706092025212016|318732|sarygitha25@gmail.com|UPT Balai Benih Pembantu Tanaman Pangan|Tata Usaha
350|Siyamto|Pelaksana PPPK|197709032025211023|343315|siyamtorapaklambur@gmail.com|UPT Balai Benih Pembantu Tanaman Pangan|Tata Usaha
351|M.Nazyarudin Miar, ST|Kepala UPT|197401012007011065|586267|muhammadnazyarudin@gmail.com|UPT Balai Benih Pembantu Hortikultura|
352|Indah Kusumawati, SP|Pelaksana PNS|198006192010012019|260467|indahpertanian80@gmail.com|UPT Balai Benih Pembantu Hortikultura|Tata Usaha
353|Gunarto|Pelaksana PNS|197407042008011017|460643|gunartoSPMA74@gmail.com|UPT Balai Benih Pembantu Hortikultura|Tata Usaha
354|Salmiah, SP|Pelaksana PNS|198106042010012028|136440|salmiah981@gmail.com|UPT Balai Benih Pembantu Hortikultura|Tata Usaha
355|Sapran|Pelaksana PNS|197503022007011022|473630|sapranwalet2@gmail.com|UPT Balai Benih Pembantu Hortikultura|Tata Usaha
356|Joko Apriyono Putro|Pelaksana PNS|197704082010011011|547341|jokoputro3256@gmail.com|UPT Balai Benih Pembantu Hortikultura|Tata Usaha
357|Adi Susanto, A.Md|Pelaksana PPPK|197705082025211011|431623|adisusantoloakulu@gmail.com|UPT Balai Benih Pembantu Hortikultura|Tata Usaha
358|Moh. Hasan|Pelaksana PPPK|197410252025211014|394017|mhasan250174@gmail.com|UPT Balai Benih Pembantu Hortikultura|Tata Usaha
359|Masroni|Pelaksana PPPK|197807042025211031|516059|mas.roni787878@gmail.com|UPT Balai Benih Pembantu Hortikultura|Tata Usaha
360|Nurodin, SP|Kepala UPT|197103102007011034|110536|norodin1971@gmail.com|UPT Balai Proteksi Tanaman Pangan Dan Hortikultura|
361|John Laurens Barus, SE|Kasubag TU UPT|197609012011011001|578876|johnbarusse@gmail.com|UPT Balai Proteksi Tanaman Pangan Dan Hortikultura|Tata Usaha
362|Elvi Noor Sukaisih, SP|Pelaksana PNS|197101132007012009|342862|sukaisihelvi77@gmail.com|UPT Balai Proteksi Tanaman Pangan Dan Hortikultura|Tata Usaha
363|Suyatun, SP|Pelaksana PNS|197307012008012017|299241|suyatun.atun17@gmail.com|UPT Balai Proteksi Tanaman Pangan Dan Hortikultura|Tata Usaha
364|Istikharah, S.Sos|Pelaksana PNS|198506032010012036|551400|istimuthia181@gmail.com|UPT Balai Proteksi Tanaman Pangan Dan Hortikultura|Tata Usaha
365|Ismiyanto|Pelaksana PNS|198209122008011011|556599|ismiyantoy3@gmail.com|UPT Balai Proteksi Tanaman Pangan Dan Hortikultura|Tata Usaha
366|Machmum Imam Cholis|Pelaksana PNS|197704262008011016|591858|machmumimamcholis@yahoo.com|UPT Balai Proteksi Tanaman Pangan Dan Hortikultura|Tata Usaha
367|Sri Heldina|Pelaksana PNS|197308012007012031|440468|dinad4804@gmail.com|UPT Balai Proteksi Tanaman Pangan Dan Hortikultura|Tata Usaha
368|Deddy Supiadi|Pelaksana PNS|198003232009021003|386442|bodettgr@gmail.com|UPT Balai Proteksi Tanaman Pangan Dan Hortikultura|Tata Usaha
369|Retno Pudji Kusumaningsih|Pelaksana PPPK|198903262025212030|116436|retnopudjikusumaningsih@gmail.com|UPT Balai Proteksi Tanaman Pangan Dan Hortikultura|Tata Usaha
370|Muhammad Nur|Pelaksana PPPK|197609012025211023|420327|norm34201@gmail.com|UPT Balai Proteksi Tanaman Pangan Dan Hortikultura|Tata Usaha
371|Aji Zikri Zulfian, S.Pt|Kepala UPT|197609202006041003|225828|ajizikrizulfian2@gmail.com|UPT Pembibitan Sapi Potong, Muara Kaman|
372|Sukianto, A.Md|Pelaksana PNS|197504192008011009|195437|sukiantokahala75@gmail.com|UPT Pembibitan Sapi Potong, Muara Kaman|Tata Usaha
373|Arbainah|Pelaksana PNS|197805022007012026|572265|arbainahbenah32@gmail.com|UPT Pembibitan Sapi Potong, Muara Kaman|Tata Usaha
374|Mirhansyah|Pelaksana PNS|197208262007011011|222643|Mirhansyah72@gmail.com|UPT Pembibitan Sapi Potong, Muara Kaman|Tata Usaha
375|Mita|Pelaksana PPPK|198610092025212026|212818|mitamufid5@gmail.com|UPT Pembibitan Sapi Potong, Muara Kaman|Tata Usaha
376|Muhtadin|Pelaksana PPPK|198812312025211071|333416|tadinbara@gmail.com|UPT Pembibitan Sapi Potong, Muara Kaman|Tata Usaha
377|Siti Asyiah, A.Md|Kepala UPT|197101132007012010|141802|sitiasyiah1971@gmail.com|UPT Pusat Kesehatan Hewan, Kota Bangun|
378|Eddy Sarjono, S.Pkp|Pelaksana PNS|197906152007011013|543457|sarjonodistan@gmail.com|UPT Pusat Kesehatan Hewan, Kota Bangun|Tata Usaha
379|Alpiansyah|Pelaksana PNS|197306242008011012|371557|alpianw7@gmail.com|UPT Pusat Kesehatan Hewan, Kota Bangun|Tata Usaha
380|Erwindo Senantha|Pelaksana PNS|197406192010011006|146862|erwindo74@gmail.com|UPT Pusat Kesehatan Hewan, Kota Bangun|Tata Usaha
381|Fitrianto|Pelaksana PNS|198606092008011003|259965|fhitriyanto@gmail.com|UPT Pusat Kesehatan Hewan, Kota Bangun|Tata Usaha
382|Syahlan Nuraidi|Pelaksana PNS|197305152001121011|131845|syahlandistan@gmail.com|UPT Pusat Kesehatan Hewan, Kota Bangun|Tata Usaha
383|Muhammad Taufik Joko Samudro|Pelaksana PNS|198403252010011024|490759|mohdtaufikjoko@gmail.com|UPT Pusat Kesehatan Hewan, Kota Bangun|Tata Usaha
384|Azhari|Pelaksana PPPK|197108012025211012|186842|azharikukar7@gmail.com|UPT Pusat Kesehatan Hewan, Kota Bangun|Tata Usaha
385|Halimah|Pelaksana PPPK|198607042025212017|539813|halimahp3k@gmail.com|UPT Pusat Kesehatan Hewan, Kota Bangun|Tata Usaha
386|Haniah|Pelaksana PPPK|197603022025212006|517024|haniahhaniah958@gmail.com|UPT Pusat Kesehatan Hewan, Kota Bangun|Tata Usaha
387|Mahlan|Pelaksana PPPK|197608092025211012|565259|mahlan0876@gmail.com|UPT Pusat Kesehatan Hewan, Kota Bangun|Tata Usaha
388|Mayang Sari|Pelaksana PPPK|198501092025212022|295848|mayangg1985@gmail.com|UPT Pusat Kesehatan Hewan, Kota Bangun|Tata Usaha
389|Nurwahidah|Pelaksana PPPK|197503112025212008|337135|mayangg1985@gmail.com|UPT Pusat Kesehatan Hewan, Kota Bangun|Tata Usaha
390|Dedi Aspawiharja|Pelaksana PPPK|198009282025211026|484726|dediaspawiharja8@gmail.com|UPT Pusat Kesehatan Hewan, Kota Bangun|Tata Usaha
391|Sukarni|Pelaksana PPPK|198807162025212076|100251|sukarnik222@gmail.com|UPT Pusat Kesehatan Hewan, Kota Bangun|Tata Usaha
392|Muhammad Akbar|Pelaksana PPPK|199604042025211070|431687|muhammadakbar960304@gmail.com|UPT Pusat Kesehatan Hewan, Kota Bangun|Tata Usaha
393|Normaliana, SP, MP|Kepala UPT|197210072007012028|502267|normaliana_disnak@yahoo.com|UPT Pusat Kesehatan Hewan, Muara Badak|
394|Sarnia, SP|Kasubag TU UPT|197607182008012017|520512|nhia.sarnia76@gmail.com|UPT Pusat Kesehatan Hewan, Muara Badak|Tata Usaha
395|Dwi Wahyuni, SP|Pelaksana PNS|197703122008012023|118535|dwicester77@gmail.com|UPT Pusat Kesehatan Hewan, Muara Badak|Tata Usaha
396|Benidektus|Pelaksana PNS|197809192007011023|430370|benirose6@gmail.com|UPT Pusat Kesehatan Hewan, Muara Badak|Tata Usaha
397|Jayus|Pelaksana PNS|198003122008011020|583310|jayuspertanian@gmail.com|UPT Pusat Kesehatan Hewan, Muara Badak|Tata Usaha
398|Muhammad Kacong|Pelaksana PNS|198111052008011015|579780|muhammadkacong81@gmail.com|UPT Pusat Kesehatan Hewan, Muara Badak|Tata Usaha
399|Muhayan|Pelaksana PNS|197203232007011018|487359|muhayan230373@gmail.Com|UPT Pusat Kesehatan Hewan, Muara Badak|Tata Usaha
400|Ridwan|Pelaksana PNS|198409022010011017|375732|ridwan.diana84@gmail.com|UPT Pusat Kesehatan Hewan, Muara Badak|Tata Usaha
401|Sadriansyah|Pelaksana PNS|197010242007011007|362872|sadriansyah2410@gmail.com|UPT Pusat Kesehatan Hewan, Muara Badak|Tata Usaha
402|Yuyun Handayani|Pelaksana PNS|197806222007012013|578497|yuyunsanga2@gmail.com|UPT Pusat Kesehatan Hewan, Muara Badak|Tata Usaha
403|Arifuddin|Pelaksana PNS|198211252012121004|134198|ary.aryanna09@gmail.com|UPT Pusat Kesehatan Hewan, Muara Badak|Tata Usaha
404|Zubaidah|Pelaksana PPPK|197811242025212012|118768|idahnunaz@gmail.com|UPT Pusat Kesehatan Hewan, Muara Badak|Tata Usaha
405|Joko Santoso, S.Sos., M.Si|Kepala UPT|197001292000121004|461288|nawaragil@gmail.com|UPT Pusat Kesehatan Hewan, Samboja|
406|Yudi Aspianta, SH|Pelaksana PNS|197206142001121005|398148|yudiaspianta.kejawa@gmail.com|UPT Pusat Kesehatan Hewan, Samboja|Tata Usaha
407|Aspiani, SP|Pelaksana PNS|197104172006041013|498453|jjaspianjjaspian@gmail.com|UPT Pusat Kesehatan Hewan, Samboja|Tata Usaha
408|Ruliansyah, SP|Pelaksana PNS|197206152008011019|293567|rully.handil@gmail.com|UPT Pusat Kesehatan Hewan, Samboja|Tata Usaha
409|Sagir S, S.Sos|Pelaksana PNS|196810282008011011|500576|sagirajalah68@gmail.com|UPT Pusat Kesehatan Hewan, Samboja|Tata Usaha
410|Satriani, S.Pkp|Pelaksana PNS|198205152008012025|527496|satriani.keswan@gmail.com|UPT Pusat Kesehatan Hewan, Samboja|Tata Usaha
411|Suwito, SE|Pelaksana PNS|197805262008011015|538305|suwitobppn46@gmail.com|UPT Pusat Kesehatan Hewan, Samboja|Tata Usaha
412|Yulianti, S.Pkp|Pelaksana PNS|197607212008012011|351635|anti.keswan@gmail.com|UPT Pusat Kesehatan Hewan, Samboja|Tata Usaha
413|Ernawati|Pelaksana PNS|197010032007012022|253530|wernawati615@gmail.com|UPT Pusat Kesehatan Hewan, Samboja|Tata Usaha
414|Harianto Jumadi|Pelaksana PNS|197808132008011016|377745|jumadikeswan78@gmail.com|UPT Pusat Kesehatan Hewan, Samboja|Tata Usaha
415|Kamsiah|Pelaksana PNS|198407052008012008|573197|Iyahsahdan0003@gmail.com|UPT Pusat Kesehatan Hewan, Samboja|Tata Usaha
416|Karno|Pelaksana PNS|197508102007011038|487136|karnosanga282@gmail.com|UPT Pusat Kesehatan Hewan, Samboja|Tata Usaha
417|Muhamad Subrantas|Pelaksana PNS|197801062007011008|257839|muhnatsir2021@gmail.com|UPT Pusat Kesehatan Hewan, Samboja|Tata Usaha
418|Supriadi|Pelaksana PNS|197912252008011015|318654|primagamasupriadi@gmail.com|UPT Pusat Kesehatan Hewan, Samboja|Tata Usaha
419|Suyanto|Pelaksana PNS|197706282000121004|556514|miraahmad77@gmail.com|UPT Pusat Kesehatan Hewan, Samboja|Tata Usaha
420|Hoeriah|Pelaksana PPPK|196909072025212007|598299|hoeriah2022@gmail.com|UPT Pusat Kesehatan Hewan, Samboja|Tata Usaha
421|Sugiyono|Pelaksana PPPK|198007012025211045|392873|yuspiabizar23@gmail.com|UPT Pusat Kesehatan Hewan, Samboja|Tata Usaha
422|Titi Lestari|Pelaksana PPPK|197311012025212001|257392|titilestari512@gmail.com|UPT Pusat Kesehatan Hewan, Samboja|Tata Usaha
423|Subadi, A.Md.Pd|Kasubag TU UPT|196808082003121004|136736|leoboy.badi@gmail.com|UPT Pusat Kesehatan Hewan, Tenggarong Seberang|Tata Usaha
424|Januri, S.Pkp|Pelaksana PNS|196902022007011021|383562|janurijatim@gmail.com|UPT Pusat Kesehatan Hewan, Tenggarong Seberang|Tata Usaha
425|Masliansyah, S.Pkp|Pelaksana PNS|196912202008011008|456624|rafanahya@gmail.com|UPT Pusat Kesehatan Hewan, Tenggarong Seberang|Tata Usaha
426|Jahriansah|Pelaksana PNS|197106042007011028|128444|jaykoetai@gmail.com|UPT Pusat Kesehatan Hewan, Tenggarong Seberang|Tata Usaha
427|Kasmir|Pelaksana PNS|197009042008011011|446549|kasmirbatuah20@gmail.com|UPT Pusat Kesehatan Hewan, Tenggarong Seberang|Tata Usaha
428|M.Sahir|Pelaksana PNS|197205062008011018|337500|msahir1972@gmail.com|UPT Pusat Kesehatan Hewan, Tenggarong Seberang|Tata Usaha
429|Maria Ulfa M|Pelaksana PNS|198106092008012026|222577|uulsifa@gmail.com|UPT Pusat Kesehatan Hewan, Tenggarong Seberang|Tata Usaha
430|Supriyanto|Pelaksana PNS|196901302008011012|270221|supriyantosebulu@gmail.com|UPT Pusat Kesehatan Hewan, Tenggarong Seberang|Tata Usaha
431|Yuli Susanti, A.Md|Pelaksana PNS|198107182010012029|561149|yulisusanti964@gmail.com|UPT Pusat Kesehatan Hewan, Tenggarong Seberang|Tata Usaha
432|Bagus Irawan|Pelaksana PPPK|198609192025211025|511906|bagus09191986@gmail.com|UPT Pusat Kesehatan Hewan, Tenggarong Seberang|Tata Usaha
433|Ade Versilia Parastika|Pelaksana PPPK|199110072025212067|399485|tenggarong0765@gmail.com|UPT Pusat Kesehatan Hewan, Tenggarong Seberang|Tata Usaha
434|Muhammad Arya Bekham|Pelaksana PPPK|200307172025211003|162439|aryabekham17@gmail.com|UPT Pusat Kesehatan Hewan, Tenggarong Seberang|Tata Usaha
435|Hendro Susanto|Pelaksana PPPK|198510202025211082|383803|hendros964@gmail.com|UPT Pusat Kesehatan Hewan, Tenggarong Seberang|Tata Usaha
436|Fathurrahman, SP|Kepala UPT|196903151994031017|344394|fathurrahmansp69@gmail.com|UPT Rumah Pemotongan Hewan Dan Pasar Hewan|
437|Titin Damayanti, SP|Kasubag TU UPT|197802262008012016|199238|titindamayanti23@gmail.com|UPT Rumah Pemotongan Hewan Dan Pasar Hewan|Tata Usaha
438|Agus Sofyan Noor, SE|Pelaksana PNS|197508252000121005|151918|agusnoor.noor@gmail.com|UPT Rumah Pemotongan Hewan Dan Pasar Hewan|Tata Usaha
439|Didik Prayitno|Pelaksana PNS|198303122008011019|227938|didikprayitno983@gmail.com|UPT Rumah Pemotongan Hewan Dan Pasar Hewan|Tata Usaha
440|Abdu Said|Pelaksana PNS|196901121999031008|138208|abdusaid121@gmail.com|UPT Rumah Pemotongan Hewan Dan Pasar Hewan|Tata Usaha
441|Edwin Odantara|Pelaksana PNS|196912032007011021|201982|edwinodantaraa@gmail.com|UPT Rumah Pemotongan Hewan Dan Pasar Hewan|Tata Usaha
442|Muhammad Syarifuddin Nur|Pelaksana PNS|197308202007011033|371983|m.syarifuddinnur@gmail.com|UPT Rumah Pemotongan Hewan Dan Pasar Hewan|Tata Usaha
443|Novia Mulyanti|Pelaksana PNS|198711112006042001|255817|noviamulyanti87@gmail.com|UPT Rumah Pemotongan Hewan Dan Pasar Hewan|Tata Usaha
444|Irwansyah|Pelaksana PPPK|198709092025211035|525635|iwanalghazali6@gmail.com|UPT Rumah Potong Hewan Dan Pasar Hewan|Tata Usaha
445|Julkifli|Pelaksana PPPK|198208212025211021|561864|julkiflijul610@gmail.com|UPT Rumah Potong Hewan Dan Pasar Hewan|Tata Usaha
446|Lisa Yuliandari|Pelaksana PPPK|198608042025212026|102103|lisaituaku04@gmail.com|UPT Rumah Potong Hewan Dan Pasar Hewan|Tata Usaha
447|Mirhansyah|Pelaksana PPPK|197407022025211017|244744|amirgaruda078@gmail.com|UPT Rumah Potong Hewan Dan Pasar Hewan|Tata Usaha
448|Murti|Pelaksana PPPK|197211252025212002|588887|murti.murdana@gmail.com|UPT Rumah Potong Hewan Dan Pasar Hewan|Tata Usaha
449|Rudy Alvian|Pelaksana PPPK|197601012025211024|497912|rudialvian03@gmail.com|UPT Rumah Potong Hewan Dan Pasar Hewan|Tata Usaha
450|Rully Gunawan|Pelaksana PPPK|198909052025211038|383516|rulig4603@gmail.com|UPT Rumah Potong Hewan Dan Pasar Hewan|Tata Usaha
451|Muhammad Alief Maulana|Pelaksana PPPK|200304162025211002|331758|alipmaulana436@gmail.com|UPT Rumah Potong Hewan Dan Pasar Hewan|Tata Usaha
452|Ishak|Pelaksana PPPK|197107102025211016|100460|ishakcool15@gmail.com|UPT Rumah Potong Hewan Dan Pasar Hewan|Tata Usaha`;

const getRoleLevel = (role) => {
  if (role === 'Admin') return 0;
  if (role === 'Kepala Dinas') return 1;
  if (role === 'Sekretaris') return 2;
  if (['Kepala Bidang', 'Kasubag Umtal', 'Kepala UPT'].includes(role)) return 3;
  if (role === 'Kasubag TU UPT') return 4;
  return 5; // PNS / PPPK
};

const parseUsersData = () => {
  const lines = rawCSVData.trim().split('\n');
  return lines.map(line => {
    const [id, name, role, nip, pin, email, dept, subDept] = line.split('|');
    return {
      id: parseInt(id, 10),
      name: name.trim(),
      role: role.trim(),
      nip: nip.trim(),
      pin: pin.trim(),
      email: email.trim(),
      dept: dept ? dept.trim() : 'Semua',
      subDept: subDept ? subDept.trim() : '',
      level: getRoleLevel(role.trim())
    };
  });
};

const initialUsers = parseUsersData();
const initialAttendance = [];

// --- MAIN APP COMPONENT ---
export default function App() {
  const [usersList, setUsersList] = useState(initialUsers);
  const [currentUser, setCurrentUser] = useState(null);
  const [attendanceData, setAttendanceData] = useState(initialAttendance);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState('dashboard');
  const [testMode, setTestMode] = useState(false); 

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogin = (user) => {
    setCurrentUser(user);
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  // --- LOGIKA HIERARKI MENGGUNAKAN NOMOR URUT / ID ---
  const getSubordinates = (user) => {
    if (!user) return [];
    
    // Semua user di unit kerja yang sama kecuali user itu sendiri
    const sameDeptUsers = usersList.filter(u => u.dept === user.dept && u.id !== user.id);

    switch (user.role) {
      case 'Kepala Dinas':
          // Kadis membawahi semua pegawai KECUALI Sekretaris dan Kepala Bidang
        return usersList.filter(u => u.id !== user.id && u.role !== 'Sekretaris' && u.role !== 'Kepala Bidang');
      
      case 'Sekretaris':
        // Sekretaris membawahi Umtal, Admin, PNS, PPPK yang nomor urutnya (ID) setelah Sekretaris & Kasubag Umtal
        return usersList.filter(u => 
          (u.dept === 'Sekretariat' || u.dept === 'Semua') &&
          ['Kasubag Umtal', 'Admin', 'Pelaksana PNS', 'Pelaksana PPPK'].includes(u.role) && 
          u.id > user.id 
        );
      
      case 'Kasubag Umtal':
        // Kasubag Umtal membawahi Pelaksana di unit kerjanya dengan urutan setelah dia
        return sameDeptUsers.filter(u => 
          ['Pelaksana PNS', 'Pelaksana PPPK'].includes(u.role) && u.id > user.id
        );
      
      case 'Kepala Bidang':
        // Kepala Bidang membawahi Pelaksana di bidangnya setelah nomor urutnya
        return sameDeptUsers.filter(u => 
          ['Pelaksana PNS', 'Pelaksana PPPK'].includes(u.role) && u.id > user.id
        );
      
      case 'Kepala UPT':
        // Kepala UPT membawahi TU UPT dan Pelaksana di UPT nya setelah nomor urutnya
        return sameDeptUsers.filter(u => 
          ['Kasubag TU UPT', 'Pelaksana PNS', 'Pelaksana PPPK'].includes(u.role) && u.id > user.id
        );
      
      case 'Kasubag TU UPT':
        // Kasubag TU UPT membawahi Pelaksana di UPT nya setelah nomor urutnya
        return sameDeptUsers.filter(u => 
          ['Pelaksana PNS', 'Pelaksana PPPK'].includes(u.role) && u.id > user.id
        );

      case 'Admin':
        // Admin melihat semua diurutkan berdasar level, lalu ID
        return [...usersList].sort((a, b) => a.level !== b.level ? a.level - b.level : a.id - b.id);

      default:
        return [];
    }
  };

  const todayDateStr = currentTime.toISOString().split('T')[0];
  
  if (!currentUser) {
    return <LoginScreen usersList={usersList} setUsersList={setUsersList} onLogin={handleLogin} />;
  }

  // --- ROLE CAPABILITIES ---
  const canSeePersonalAbsence = ['Pelaksana PNS', 'Pelaksana PPPK', 'Kasubag Umtal', 'Kepala UPT', 'Kasubag TU UPT', 'Admin'].includes(currentUser.role);
  const canSeeSubordinates = ['Kepala Dinas', 'Sekretaris', 'Kepala Bidang', 'Kasubag Umtal', 'Kepala UPT', 'Kasubag TU UPT', 'Admin'].includes(currentUser.role);
  const isAdmin = currentUser.role === 'Admin';

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800 flex flex-col md:flex-row">
      {/* SIDEBAR */}
      <aside className="bg-white w-full md:w-64 border-r border-gray-200 flex flex-col shadow-sm flex-shrink-0">
        <div className="p-6 flex items-center justify-center border-b border-gray-100">
          <div className="bg-green-100 p-3 rounded-full text-green-600 mr-3">
            <Activity size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-green-700 leading-tight">Absensi<br/>Distanak</h1>
          </div>
        </div>
        
        <div className="p-4 border-b border-gray-100 bg-green-50">
          <p className="text-sm text-gray-500">Masuk sebagai:</p>
          <p className="font-semibold text-gray-800 text-sm truncate" title={currentUser.name}>{currentUser.name}</p>
          <p className="text-xs font-medium text-green-600 bg-green-100 inline-block px-2 py-1 rounded mt-1">{currentUser.role}</p>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center p-3 rounded-lg transition-colors ${activeTab === 'dashboard' ? 'bg-green-500 text-white shadow-md' : 'text-gray-600 hover:bg-green-50 hover:text-green-600'}`}
          >
            <CalendarIcon size={20} className="mr-3" />
            Dashboard
          </button>
          
          {(canSeePersonalAbsence) && (
            <button 
              onClick={() => setActiveTab('history')}
              className={`w-full flex items-center p-3 rounded-lg transition-colors ${activeTab === 'history' ? 'bg-green-500 text-white shadow-md' : 'text-gray-600 hover:bg-green-50 hover:text-green-600'}`}
            >
              <FileText size={20} className="mr-3" />
              Riwayat Pribadi
            </button>
          )}

          <button 
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center p-3 rounded-lg transition-colors ${activeTab === 'settings' ? 'bg-green-500 text-white shadow-md' : 'text-gray-600 hover:bg-green-50 hover:text-green-600'}`}
          >
            <Settings size={20} className="mr-3" />
            Pengaturan Akun
          </button>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
          >
            <LogOut size={20} className="mr-2" />
            Keluar
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto">
        {/* Header / Clock */}
        <header className="bg-white p-4 shadow-sm flex flex-col md:flex-row justify-between items-center z-10 sticky top-0">
          <h2 className="text-2xl font-bold text-gray-800 capitalize mb-2 md:mb-0">
            {activeTab === 'dashboard' ? 'Dashboard Utama' : 
             activeTab === 'history' ? 'Riwayat Kehadiran' : 'Pengaturan Akun'}
          </h2>
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-lg font-mono font-semibold text-gray-700 bg-gray-100 px-4 py-2 rounded-lg">
              <Clock size={20} className="mr-2 text-green-600" />
              {currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })} WITA
            </div>
          </div>
        </header>

        <div className="p-6 max-w-6xl mx-auto space-y-6">
          {activeTab === 'dashboard' && (
            <>
              {/* TEST MODE TOGGLE */}
              <div className="flex justify-end mb-4">
                <label className="flex items-center cursor-pointer bg-white px-3 py-1 rounded-full shadow-sm border border-gray-200">
                  <span className="mr-3 text-sm font-medium text-gray-600">Bypass Jam (Tes):</span>
                  <input type="checkbox" className="sr-only peer" checked={testMode} onChange={() => setTestMode(!testMode)} />
                  <div className="relative w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500"></div>
                </label>
              </div>

              {canSeePersonalAbsence && (
                <PersonalAttendanceCard 
                  user={currentUser} 
                  attendanceData={attendanceData} 
                  setAttendanceData={setAttendanceData}
                  currentTime={currentTime}
                  todayDateStr={todayDateStr}
                  testMode={testMode}
                />
              )}

              {isAdmin && (
                <AdminStats attendanceData={attendanceData} usersList={usersList} todayDateStr={todayDateStr} />
              )}

              {canSeeSubordinates && (
                <SubordinateManagement 
                  subordinates={getSubordinates(currentUser)}
                  attendanceData={attendanceData}
                  setAttendanceData={setAttendanceData}
                  todayDateStr={todayDateStr}
                  isAdmin={isAdmin}
                />
              )}
            </>
          )}

          {activeTab === 'history' && canSeePersonalAbsence && (
            <PersonalHistory 
              user={currentUser} 
              attendanceData={attendanceData} 
            />
          )}

          {activeTab === 'settings' && (
            <AccountSettings user={currentUser} />
          )}
        </div>
      </main>
    </div>
  );
}

// --- COMPONENTS ---

function LoginScreen({ usersList, setUsersList, onLogin }) {
  const [nip, setNip] = useState('');
  const [pin, setPin] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  
  // Forgot Password States
  const [isForgotMode, setIsForgotMode] = useState(false);
  const [forgotStep, setForgotStep] = useState(1); // 1: Req Code, 2: Update PIN
  const [resetEmailMasked, setResetEmailMasked] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [inputCode, setInputCode] = useState('');
  const [newPin, setNewPin] = useState('');

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const user = usersList.find(u => u.nip === nip && u.pin === pin);
    if (user) {
      setErrorMsg('');
      onLogin(user);
    } else {
      setErrorMsg('NIP atau PIN Anda salah.');
    }
  };

  const maskEmail = (email) => {
    if(!email) return '';
    const [name, domain] = email.split('@');
    if(!domain) return email;
    return `${name.substring(0, 3)}***@${domain}`;
  };

  const handleSendResetCode = (e) => {
    e.preventDefault();
    const user = usersList.find(u => u.nip === nip);
    if (user) {
      if(!user.email) {
         setErrorMsg('Email tidak terdaftar untuk NIP ini.');
         return;
      }
      setErrorMsg('');
      setResetEmailMasked(maskEmail(user.email));
      setGeneratedCode('123456'); // Simulasi kode verifikasi
      setForgotStep(2);
      alert(`[SIMULASI] Kode verifikasi "123456" telah dikirim ke ${user.email}`);
    } else {
      setErrorMsg('NIP tidak ditemukan dalam sistem.');
    }
  };

  const handleSaveNewPin = (e) => {
    e.preventDefault();
    if(inputCode !== generatedCode) {
      setErrorMsg('Kode verifikasi salah.');
      return;
    }
    if(newPin.length < 4) {
      setErrorMsg('PIN baru minimal 4 karakter.');
      return;
    }
    
    // Update PIN in usersList state (Simulasi)
    setUsersList(prev => prev.map(u => u.nip === nip ? {...u, pin: newPin} : u));
    alert('PIN berhasil diubah! Silahkan login dengan PIN baru Anda.');
    
    // Reset to login mode
    setIsForgotMode(false);
    setForgotStep(1);
    setPin('');
    setNip('');
    setInputCode('');
    setNewPin('');
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center p-4 font-sans">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="bg-green-600 p-8 text-center text-white relative">
          <Activity size={48} className="mx-auto mb-4 opacity-90" />
          <h1 className="text-3xl font-bold mb-1">Absensi Distanak</h1>
          <p className="text-green-100 text-sm">Sistem Kehadiran Digital Dinas Pertanian & Peternakan</p>
        </div>
        
        <div className="p-8">
          {errorMsg && (
            <div className="mb-4 bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-start">
              <AlertCircle size={18} className="mr-2 mt-0.5 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {!isForgotMode ? (
            // FORM LOGIN
            <form onSubmit={handleLoginSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2 text-sm">Nomor Induk Pegawai (NIP)</label>
                <input 
                  type="text" 
                  required
                  placeholder="Masukkan NIP Anda"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  value={nip}
                  onChange={(e) => setNip(e.target.value)}
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2 text-sm flex justify-between">
                  <span>PIN / Kata Sandi</span>
                  <button type="button" onClick={() => { setIsForgotMode(true); setErrorMsg(''); }} className="text-green-600 hover:text-green-800 text-xs font-semibold">
                    Lupa PIN?
                  </button>
                </label>
                <input 
                  type="password" 
                  required
                  placeholder="Masukkan PIN"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-colors flex justify-center items-center shadow-lg"
              >
                Login Aplikasi
              </button>
            </form>

          ) : (
            // FORM LUPA PASSWORD
            <div>
              <div className="flex items-center mb-6 text-gray-700">
                <button type="button" onClick={() => { setIsForgotMode(false); setForgotStep(1); setErrorMsg(''); }} className="mr-2 hover:bg-gray-100 p-1 rounded-full transition">
                  <XCircle size={20} className="text-gray-400" />
                </button>
                <h2 className="text-lg font-bold">Pemulihan PIN</h2>
              </div>

              {forgotStep === 1 ? (
                <form onSubmit={handleSendResetCode}>
                  <p className="text-sm text-gray-500 mb-4">Masukkan NIP Anda. Kami akan mengirimkan kode verifikasi ke email yang terdaftar pada akun Anda.</p>
                  <div className="mb-6">
                    <label className="block text-gray-700 font-medium mb-2 text-sm">NIP Anda</label>
                    <input 
                      type="text" required
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-green-500 focus:border-green-500"
                      value={nip} onChange={(e) => setNip(e.target.value)}
                    />
                  </div>
                  <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors flex justify-center items-center shadow">
                    <Mail size={18} className="mr-2" /> Kirim Kode Verifikasi
                  </button>
                </form>
              ) : (
                <form onSubmit={handleSaveNewPin}>
                  <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg mb-4 text-sm text-blue-800">
                    Kode 6 digit telah dikirim ke: <strong>{resetEmailMasked}</strong>
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2 text-sm">Kode Verifikasi</label>
                    <input 
                      type="text" required placeholder="Contoh: 123456"
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-green-500 focus:border-green-500 tracking-widest text-center text-lg"
                      value={inputCode} onChange={(e) => setInputCode(e.target.value)}
                    />
                  </div>
                  <div className="mb-6">
                    <label className="block text-gray-700 font-medium mb-2 text-sm">PIN / Password Baru</label>
                    <input 
                      type="password" required placeholder="Minimal 4 karakter"
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-green-500 focus:border-green-500"
                      value={newPin} onChange={(e) => setNewPin(e.target.value)}
                    />
                  </div>
                  <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-colors flex justify-center items-center shadow">
                    <KeyRound size={18} className="mr-2" /> Simpan PIN Baru
                  </button>
                </form>
              )}
            </div>
          )}

         
        </div>
      </div>
    </div>
  );
}

function PersonalAttendanceCard({ user, attendanceData, setAttendanceData, currentTime, todayDateStr, testMode }) {
  const [message, setMessage] = useState('');

  const todayRecord = attendanceData.find(a => a.userId === user.id && a.date === todayDateStr);
  const hour = currentTime.getHours();
  const minute = currentTime.getMinutes();
  const timeFloat = hour + (minute / 60);

  const isMasukTime = (timeFloat >= 6.5 && timeFloat <= 8.0) || testMode; // 06:30 - 08:00
  const isPulangTime = (timeFloat >= 16.0 && timeFloat <= 18.0) || testMode; // 16:00 - 18:00

  const handleAbsenMasuk = () => {
    if (!isMasukTime) {
      setMessage('Di luar jam absen masuk (06:30 - 08:00 WITA)');
      return;
    }
    if (todayRecord && todayRecord.timeIn) {
      setMessage('Anda sudah absen masuk hari ini.');
      return;
    }

    const timeStr = currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    if (todayRecord) {
      setAttendanceData(prev => prev.map(a => a.id === todayRecord.id ? { ...a, timeIn: timeStr, status: 'Hadir' } : a));
    } else {
      setAttendanceData(prev => [...prev, {
        id: Date.now(),
        userId: user.id,
        date: todayDateStr,
        status: 'Hadir',
        timeIn: timeStr,
        timeOut: '',
        notes: ''
      }]);
    }
    setMessage('Berhasil absen masuk pada ' + timeStr);
  };

  const handleAbsenPulang = () => {
    if (!isPulangTime) {
      setMessage('Di luar jam absen pulang (16:00 - 18:00 WITA)');
      return;
    }
    if (!todayRecord || !todayRecord.timeIn) {
      setMessage('Anda belum absen masuk, tidak bisa absen pulang.');
      return;
    }
    if (todayRecord.timeOut) {
      setMessage('Anda sudah absen pulang hari ini.');
      return;
    }

    const timeStr = currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    setAttendanceData(prev => prev.map(a => a.id === todayRecord.id ? { ...a, timeOut: timeStr } : a));
    setMessage('Berhasil absen pulang pada ' + timeStr);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-800 flex items-center">
          <UserCheck className="mr-2 text-green-500" size={24} />
          Absensi Pribadi Hari Ini
        </h3>
        <span className="text-sm font-medium text-gray-500">
          {currentTime.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </span>
      </div>
      
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col items-center p-6 bg-green-50 rounded-xl border border-green-100">
          <h4 className="text-green-800 font-semibold mb-2">Absen Masuk Pagi</h4>
          <p className="text-xs text-green-600 mb-4">06:30 - 08:00 WITA</p>
          
          {todayRecord?.timeIn ? (
            <div className="flex flex-col items-center text-green-600 font-bold">
              <CheckCircle size={48} className="mb-2" />
              Tercatat: {todayRecord.timeIn} WITA
            </div>
          ) : (
            <button 
              onClick={handleAbsenMasuk}
              className={`w-full max-w-[200px] py-4 rounded-full font-bold text-lg text-white shadow-lg transition-transform transform hover:scale-105 active:scale-95 ${isMasukTime ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-300 cursor-not-allowed shadow-none'}`}
            >
              KLIK MASUK
            </button>
          )}
        </div>

        <div className="flex flex-col items-center p-6 bg-blue-50 rounded-xl border border-blue-100">
          <h4 className="text-blue-800 font-semibold mb-2">Absen Pulang Sore</h4>
          <p className="text-xs text-blue-600 mb-4">16:00 - 18:00 WITA</p>
          
          {todayRecord?.timeOut ? (
            <div className="flex flex-col items-center text-blue-600 font-bold">
              <CheckCircle size={48} className="mb-2" />
              Tercatat: {todayRecord.timeOut} WITA
            </div>
          ) : (
            <button 
              onClick={handleAbsenPulang}
              className={`w-full max-w-[200px] py-4 rounded-full font-bold text-lg text-white shadow-lg transition-transform transform hover:scale-105 active:scale-95 ${isPulangTime && todayRecord?.timeIn ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-300 cursor-not-allowed shadow-none'}`}
            >
              KLIK PULANG
            </button>
          )}
        </div>
      </div>

      {message && (
        <div className="px-6 pb-6">
          <div className="bg-gray-800 text-white p-3 rounded-lg text-center text-sm">
            {message}
          </div>
        </div>
      )}
    </div>
  );
}

function SubordinateManagement({ subordinates, attendanceData, setAttendanceData, todayDateStr, isAdmin }) {
  const [editingRecord, setEditingRecord] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const getStatusColor = (status) => {
    switch(status) {
      case 'Hadir': return 'bg-green-100 text-green-800';
      case 'Cuti': return 'bg-blue-100 text-blue-800';
      case 'Sakit': return 'bg-yellow-100 text-yellow-800';
      case 'Tanpa Keterangan': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleEditClick = (subordinate) => {
    const existing = attendanceData.find(a => a.userId === subordinate.id && a.date === todayDateStr);
    if (existing) {
      setEditingRecord({ ...existing, userName: subordinate.name });
    } else {
      setEditingRecord({
        id: Date.now() + Math.random(),
        userId: subordinate.id,
        userName: subordinate.name,
        date: todayDateStr,
        status: 'Tanpa Keterangan',
        timeIn: '',
        timeOut: '',
        notes: ''
      });
    }
  };

  const saveEdit = () => {
    const exists = attendanceData.find(a => a.id === editingRecord.id);
    if (exists) {
      setAttendanceData(prev => prev.map(a => a.id === editingRecord.id ? editingRecord : a));
    } else {
      setAttendanceData(prev => [...prev, {
        id: editingRecord.id,
        userId: editingRecord.userId,
        date: editingRecord.date,
        status: editingRecord.status,
        timeIn: editingRecord.timeIn,
        timeOut: editingRecord.timeOut,
        notes: editingRecord.notes
      }]);
    }
    setEditingRecord(null);
  };

  const filteredSubordinates = subordinates.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h3 className="text-lg font-bold text-gray-800 flex items-center">
            <Users className="mr-2 text-green-500" size={24} />
            Daftar Kehadiran Bawahan / Pegawai
          </h3>
          <p className="text-sm text-gray-500 mt-1">Total {subordinates.length} Pegawai | Tanggal: {new Date().toLocaleDateString('id-ID')}</p>
        </div>
        
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full lg:w-auto">
          <input 
            type="text" 
            placeholder="Cari nama..." 
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full sm:w-48"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <button onClick={() => alert('Fitur Ekspor PDF (Simulasi)')} className="flex items-center justify-center text-sm bg-red-50 text-red-600 hover:bg-red-100 px-3 py-2 rounded-lg transition whitespace-nowrap">
            <Download size={16} className="mr-1" /> PDF
          </button>
          <button onClick={() => alert('Fitur Ekspor Excel (Simulasi)')} className="flex items-center justify-center text-sm bg-green-50 text-green-600 hover:bg-green-100 px-3 py-2 rounded-lg transition whitespace-nowrap">
            <Download size={16} className="mr-1" /> Excel
          </button>
          {isAdmin && (
            <button onClick={() => window.print()} className="flex items-center justify-center text-sm bg-gray-50 text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-lg transition border border-gray-200 whitespace-nowrap">
              <Printer size={16} className="mr-1" /> Rekap
            </button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto max-h-[500px]">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 bg-gray-50 z-10 shadow-sm">
            <tr className="text-gray-600 text-sm">
              <th className="p-4 border-b font-semibold">No</th>
              <th className="p-4 border-b font-semibold min-w-[200px]">Nama Pegawai</th>
              <th className="p-4 border-b font-semibold">Unit Kerja</th>
              <th className="p-4 border-b font-semibold">Status</th>
              <th className="p-4 border-b font-semibold">Masuk</th>
              <th className="p-4 border-b font-semibold">Pulang</th>
              <th className="p-4 border-b font-semibold">Keterangan</th>
              <th className="p-4 border-b font-semibold text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {filteredSubordinates.map(sub => {
              const record = attendanceData.find(a => a.userId === sub.id && a.date === todayDateStr) || { status: 'Tanpa Keterangan', timeIn: '-', timeOut: '-', notes: '-' };
              
              return (
                <tr key={sub.id} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-gray-500">{sub.id}</td>
                  <td className="p-4 font-medium text-gray-800">
                     {sub.name}
                     <div className="text-xs text-gray-400 font-normal">{sub.role}</div>
                  </td>
                  <td className="p-4 text-gray-500 text-xs">{sub.dept}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-[11px] font-bold ${getStatusColor(record.status)} whitespace-nowrap`}>
                      {record.status}
                    </span>
                  </td>
                  <td className="p-4 text-gray-600 font-mono">{record.timeIn || '-'}</td>
                  <td className="p-4 text-gray-600 font-mono">{record.timeOut || '-'}</td>
                  <td className="p-4 text-gray-500 truncate max-w-[120px]" title={record.notes}>{record.notes || '-'}</td>
                  <td className="p-4 text-center">
                    <button 
                      onClick={() => handleEditClick(sub)}
                      className="text-green-600 hover:text-green-800 bg-green-50 hover:bg-green-100 px-3 py-1 rounded transition whitespace-nowrap"
                    >
                      Ubah Status
                    </button>
                  </td>
                </tr>
              );
            })}
            {filteredSubordinates.length === 0 && (
              <tr>
                <td colSpan="8" className="p-8 text-center text-gray-500">
                  Tidak ada data pegawai yang ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editingRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Ubah Status Kehadiran</h3>
              <button onClick={() => setEditingRecord(null)} className="text-gray-400 hover:text-gray-600">
                <XCircle size={24} />
              </button>
            </div>
            
            <div className="mb-4 bg-gray-50 p-3 rounded text-sm text-gray-600">
              Pegawai: <strong className="text-gray-800">{editingRecord.userName}</strong>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status Kehadiran</label>
                <select 
                  className="w-full border border-gray-300 rounded p-2 focus:ring-green-500 focus:border-green-500"
                  value={editingRecord.status}
                  onChange={(e) => setEditingRecord({...editingRecord, status: e.target.value})}
                >
                  <option value="Hadir">Hadir</option>
                  <option value="Sakit">Sakit</option>
                  <option value="Cuti">Cuti</option>
                  <option value="Tanpa Keterangan">Tanpa Keterangan</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Jam Masuk</label>
                  <input 
                    type="time" 
                    className="w-full border border-gray-300 rounded p-2"
                    value={editingRecord.timeIn}
                    onChange={(e) => setEditingRecord({...editingRecord, timeIn: e.target.value})}
                    disabled={editingRecord.status !== 'Hadir'}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Jam Pulang</label>
                  <input 
                    type="time" 
                    className="w-full border border-gray-300 rounded p-2"
                    value={editingRecord.timeOut}
                    onChange={(e) => setEditingRecord({...editingRecord, timeOut: e.target.value})}
                    disabled={editingRecord.status !== 'Hadir'}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Keterangan Tambahan</label>
                <textarea 
                  className="w-full border border-gray-300 rounded p-2 h-24"
                  placeholder="Contoh: Surat sakit terlampir, dll."
                  value={editingRecord.notes}
                  onChange={(e) => setEditingRecord({...editingRecord, notes: e.target.value})}
                ></textarea>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button onClick={() => setEditingRecord(null)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">
                Batal
              </button>
              <button onClick={saveEdit} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded shadow">
                Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AdminStats({ attendanceData, usersList, todayDateStr }) {
  const totalPegawai = usersList.length;
  let hadir = 0, sakit = 0, cuti = 0, tk = 0;

  usersList.forEach(u => {
    const record = attendanceData.find(a => a.userId === u.id && a.date === todayDateStr);
    if (!record) { tk++; }
    else if (record.status === 'Hadir') { hadir++; }
    else if (record.status === 'Sakit') { sakit++; }
    else if (record.status === 'Cuti') { cuti++; }
    else if (record.status === 'Tanpa Keterangan') { tk++; }
  });

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white p-4 rounded-xl shadow-sm border border-l-4 border-l-green-500">
        <p className="text-sm text-gray-500 mb-1">Total Hadir</p>
        <p className="text-2xl font-bold text-gray-800">{hadir} <span className="text-sm font-normal text-gray-400">/ {totalPegawai}</span></p>
      </div>
      <div className="bg-white p-4 rounded-xl shadow-sm border border-l-4 border-l-yellow-500">
        <p className="text-sm text-gray-500 mb-1">Sakit</p>
        <p className="text-2xl font-bold text-gray-800">{sakit}</p>
      </div>
      <div className="bg-white p-4 rounded-xl shadow-sm border border-l-4 border-l-blue-500">
        <p className="text-sm text-gray-500 mb-1">Cuti</p>
        <p className="text-2xl font-bold text-gray-800">{cuti}</p>
      </div>
      <div className="bg-white p-4 rounded-xl shadow-sm border border-l-4 border-l-red-500">
        <p className="text-sm text-gray-500 mb-1">Tanpa Keterangan</p>
        <p className="text-2xl font-bold text-gray-800">{tk}</p>
      </div>
    </div>
  );
}

function PersonalHistory({ user, attendanceData }) {
  const userHistory = attendanceData.filter(a => a.userId === user.id).sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h3 className="text-lg font-bold text-gray-800">Catatan & Riwayat Absensi Anda</h3>
        <p className="text-sm text-gray-500">Menampilkan rekaman kehadiran Anda sebelumnya.</p>
      </div>
      <div className="p-6">
        {userHistory.length === 0 ? (
          <div className="text-center text-gray-500 py-10 bg-gray-50 rounded-lg">
            <AlertCircle className="mx-auto mb-2 text-gray-400" size={32} />
            Belum ada riwayat absensi yang tercatat.
          </div>
        ) : (
          <div className="space-y-4">
            {userHistory.map((record, idx) => (
              <div key={idx} className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow">
                <div className="flex items-center mb-3 md:mb-0">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 text-white font-bold
                    ${record.status === 'Hadir' ? 'bg-green-500' : 
                      record.status === 'Sakit' ? 'bg-yellow-500' : 
                      record.status === 'Cuti' ? 'bg-blue-500' : 'bg-red-500'}`}
                  >
                    {record.status.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">{new Date(record.date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</h4>
                    <p className="text-sm text-gray-500">Status: <span className="font-semibold text-gray-700">{record.status}</span></p>
                  </div>
                </div>
                
                <div className="flex space-x-6 text-sm w-full md:w-auto bg-gray-50 md:bg-transparent p-3 md:p-0 rounded-lg">
                  <div>
                    <p className="text-gray-500 mb-1">Jam Masuk</p>
                    <p className="font-semibold text-gray-800">{record.timeIn || '--:--'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Jam Pulang</p>
                    <p className="font-semibold text-gray-800">{record.timeOut || '--:--'}</p>
                  </div>
                  {(record.notes) && (
                    <div>
                      <p className="text-gray-500 mb-1">Catatan</p>
                      <p className="font-medium text-gray-700 italic">{record.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function AccountSettings({ user }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 max-w-2xl overflow-hidden mx-auto">
      <div className="bg-green-500 h-24"></div>
      <div className="px-6 pb-6">
        <div className="flex justify-center -mt-12 mb-4">
          <div className="w-24 h-24 bg-white rounded-full p-1 shadow-lg">
            <div className="w-full h-full bg-green-100 rounded-full flex items-center justify-center text-green-600 text-3xl font-bold">
              {user.name.charAt(0)}
            </div>
          </div>
        </div>
        
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
          <p className="text-green-600 font-medium">{user.role}</p>
          <p className="text-gray-500 text-sm mt-1">{user.dept} {user.subDept && `- ${user.subDept}`}</p>
        </div>

        <div className="space-y-4">
          <h3 className="font-bold text-gray-800 border-b pb-2">Informasi Profil</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-1 md:gap-4 border-b border-gray-50 pb-3">
            <div className="text-gray-500 text-sm">Nomor Induk Pegawai</div>
            <div className="col-span-2 font-medium text-gray-800 font-mono">{user.nip}</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-1 md:gap-4 border-b border-gray-50 pb-3">
            <div className="text-gray-500 text-sm">Alamat Email</div>
            <div className="col-span-2 font-medium text-gray-800">{user.email || '-'}</div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-1 md:gap-4 border-b border-gray-50 pb-3">
            <div className="text-gray-500 text-sm">Role Akses</div>
            <div className="col-span-2 font-medium text-gray-800">{user.role}</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-1 md:gap-4 pb-3">
            <div className="text-gray-500 text-sm">Status Akun</div>
            <div className="col-span-2 font-medium text-green-600 flex items-center">
              <CheckCircle size={16} className="mr-1" /> Aktif
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}