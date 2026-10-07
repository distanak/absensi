import React, { useState, useEffect, useMemo } from 'react';
import { Calendar as CalendarIcon, FileText, Settings, LogOut, User } from 'lucide-react';
import Cookies from 'js-cookie';
import logoDistanak from './assets/logo-distanak.png';
import Swal from 'sweetalert2';
import { Geolocation } from '@capacitor/geolocation';
import emailjs from '@emailjs/browser'; // Pastikan emailjs diimport jika menggunakan modul npm, atau hapus baris ini jika menggunakan CDN global
import { supabase } from './supabaseClient'; 

const getRandomTime = (seed, startHour, startMin, endHour, endMin) => {
  let hash = 0;
  const str = String(seed);
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const rng = Math.abs(hash % 1000) / 1000;
  const startTotal = startHour * 60 + startMin;
  const endTotal = endHour * 60 + endMin;
  const randomTotal = Math.floor(startTotal + rng * (endTotal - startTotal));
  const hh = String(Math.floor(randomTotal / 60)).padStart(2, '0');
  const mm = String(randomTotal % 60).padStart(2, '0');
  return `${hh}:${mm}`;
};



// --- DATA PEGAWAI (CSV PARSED) ---
const rawCSVData = `1|M.Sahir|WFA|197205062008011018|197205062008011018|distanak@kukarkab.go.id|Balai Penyuluhan Pertanian Sebulu|
2|Kasmir|WFA|197009042008011011|197009042008011011|distanak@kukarkab.go.id|Balai Penyuluhan Pertanian Sebulu|
3|Maria Ulfa M|WFA|198106092008012026|198106092008012026|distanak@kukarkab.go.id|Balai Penyuluhan Pertanian Sebulu|
4|Supriyanto|WFA|196901302008011012|196901302008011012|distanak@kukarkab.go.id|Balai Penyuluhan Pertanian Sebulu|
5|Yudi Aspianta, SH|WFA|197206142001121005|197206142001121005|distanak@kukarkab.go.id|UPT Puskeswan Samboja|Pos Sanga-Sanga
6|Ernawati|WFA|197010032007012022|197010032007012022|distanak@kukarkab.go.id|UPT Puskeswan Samboja|Pos Sanga-Sanga
7|Karno|WFA|197508102007011038|197508102007011038|distanak@kukarkab.go.id|UPT Puskeswan Samboja|Pos Sanga-Sanga
8|Aspiani, SP|WFA|197104172006041013|197104172006041013|distanak@kukarkab.go.id|UPT Puskeswan Samboja|Pos Muara Jawa
9|Satriani, S.Pkp|WFA|198205152008012025|198205152008012025|distanak@kukarkab.go.id|UPT Puskeswan Samboja|Pos Muara Jawa
10|Yulianti, S.Pkp|WFA|197607212008012011|197607212008012011|distanak@kukarkab.go.id|UPT Puskeswan Samboja|Pos Muara Jawa
11|Harianto Jumadi|WFA|197808132008011016|197808132008011016|distanak@kukarkab.go.id|UPT Puskeswan Samboja|Pos Muara Jawa
12|Ruliansyah, SP|WFA|197206152008011019|197206152008011019|distanak@kukarkab.go.id|UPT Puskeswan Samboja|Pos Muara Jawa, Handil Baru
13|Subadi, A.Md.Pd|WFA|196808082003121004|196808082003121004|distanak@kukarkab.go.id|UPT Puskeswan Tenggarong Seberang|
14|Januri, S.Pkp|WFA|196902022007011021|196902022007011021|distanak@kukarkab.go.id|UPT Puskeswan Tenggarong Seberang|
15|Masliansyah, S.Pkp|WFA|196912202008011008|196912202008011008|distanak@kukarkab.go.id|UPT Puskeswan Tenggarong Seberang|
16|Jahriansah|WFA|197106042007011028|197106042007011028|distanak@kukarkab.go.id|UPT Puskeswan Tenggarong Seberang|
17|Yuli Susanti,  A.Md|WFA|198107182010012029|198107182010012029|distanak@kukarkab.go.id|UPT Puskeswan Tenggarong Seberang|
18|Bagus Irawan|WFA|198609192025211025|198609192025211025|distanak@kukarkab.go.id|UPT Puskeswan Tenggarong Seberang|
19|Ade Versilia Parastika|WFA|199110072025212067|199110072025212067|distanak@kukarkab.go.id|UPT Puskeswan Tenggarong Seberang|
20|Hendro Susanto|WFA|198510202025211082|198510202025211082|distanak@kukarkab.go.id|UPT Puskeswan Tenggarong Seberang|
21|Drh. Rianty Novita Sari|WFA|199606032025212025|199606032025212025|distanak@kukarkab.go.id|UPT Puskeswan Tenggarong Seberang|
22|Ramadana, S.P|WFA|199412052025212048|199412052025212048|distanak@kukarkab.go.id|UPT Puskeswan Tenggarong Seberang|
23|Jamroni|WFA|198203162009021003|198203162009021003|distanak@kukarkab.go.id|Balai Penyuluhan Pertanian Tenggarong|
24|Etri Dayanti|WFA|198703172025212023|198703172025212023|distanak@kukarkab.go.id|Balai Penyuluhan Pertanian Tenggarong|
25|Nadya Febrianti Putri|WFA|199702232025212015|199702232025212015|distanak@kukarkab.go.id|Balai Penyuluhan Pertanian Tenggarong|
26|Rendi Irawan|WFA|198407272010011031|198407272010011031|distanak@kukarkab.go.id|Balai Penyuluhan Pertanian Tenggarong|
27|Habiburrohman|WFA|199705292025211029|199705292025211029|distanak@kukarkab.go.id|Balai Penyuluhan Pertanian Teluk Dalam|
28|Badran, S.HI|WFA|197408072007011034|197408072007011034|distanak@kukarkab.go.id|Balai Penyuluhan Pertanian Teluk Dalam|
29|Hermanto|WFA|197501052009061005|197501052009061005|distanak@kukarkab.go.id|Balai Penyuluhan Pertanian Teluk Dalam|
30|Nur Hafijah, S.P|WFA|199101172025212031|199101172025212031|distanak@kukarkab.go.id|Balai Penyuluhan Pertanian Teluk Dalam|
31|Tria Ahmadi, SE|WFA|199007262025211029|199007262025211029|distanak@kukarkab.go.id|Balai Penyuluhan Pertanian Teluk Dalam|
32|Dinna Yulinda, S.T.P|WFA|199507172025212069|199507172025212069|distanak@kukarkab.go.id|Balai Penyuluhan Pertanian Teluk Dalam|
33|Pitri Anggawati, S.P|WFA|199004302025212041|199004302025212041|distanak@kukarkab.go.id|Balai Penyuluhan Pertanian Teluk Dalam|
34|Ahmad Muslim, S.P|WFA|198808132025211021|198808132025211021|distanak@kukarkab.go.id|Balai Penyuluhan Pertanian Kota Bangun|
35|Emelda Riska Susanti, S.P|WFA|198202232025212016|198202232025212016|distanak@kukarkab.go.id|Balai Penyuluhan Pertanian Kota Bangun|
36|Nanang Effendi|WFA|197606162025211018|197606162025211018|distanak@kukarkab.go.id|Balai Penyuluhan Pertanian Kota Bangun|
37|Putra Adiatma|WFA|198903092025211034|198903092025211034|distanak@kukarkab.go.id|Balai Penyuluhan Pertanian Kota Bangun|
38|Syafitriansyah|WFA|197709172025211018|197709172025211018|distanak@kukarkab.go.id|Balai Penyuluhan Pertanian Kota Bangun|
39|Dita Siskiani|WFA|199212182025212025|199212182025212025|distanak@kukarkab.go.id|BPP Kota Bangun Pos Desa Sumber Sari|
40|Alfian Hadi, A.Md|WFA|198107242008011011|198107242008011011|distanak@kukarkab.go.id|Balai Penyuluhan Pertanian Loa Janan|
41|Mulyani|WFA|198001152008012012|198001152008012012|distanak@kukarkab.go.id|Balai Penyuluhan Pertanian Loa Janan|
42|Suprapti, S.P|WFA|198306102025212026|198306102025212026|distanak@kukarkab.go.id|Balai Penyuluhan Pertanian Loa Janan|
43|Diana Munawwarah, SP|WFA|197602272001122003|197602272001122003|distanak@kukarkab.go.id|Balai Penyuluhan Pertanian Loa Janan|
44|Desy Susanti, S.Kom|WFA|198112012008012016|198112012008012016|distanak@kukarkab.go.id|Balai Penyuluhan Pertanian Loa Janan|
45|Khrisna Yuniarti, A.Md, S.Hut|WFA|197806182008012025|197806182008012025|distanak@kukarkab.go.id|Balai Penyuluhan Pertanian Loa Janan|
46|Andi Wahyudi|WFA|198310022012121003|198310022012121003|distanak@kukarkab.go.id|Balai Penyuluhan Pertanian Loa Janan|
47|Anggi Wijaya Mulawarman, SH|WFA|198410032025211020|198410032025211020|distanak@kukarkab.go.id|Balai Penyuluhan Pertanian Loa Janan|
48|Dwi Febriatiningsih|WFA|198102182025212018|198102182025212018|distanak@kukarkab.go.id|Balai Penyuluhan Pertanian Loa Janan|
49|Tri Endang Wahyuni|WFA|199303022025212027|199303022025212027|distanak@kukarkab.go.id|Balai Penyuluhan Pertanian Loa Janan|
50|Husni Thamrin|WFA|196808162006041013|196808162006041013|distanak@kukarkab.go.id|Balai Penyuluhan Pertanian Loa Janan|
51|Adi Susanto, A.Md|WFA|197705082025211011|197705082025211011|distanak@kukarkab.go.id|Balai Penyuluhan Pertanian Loa Kulu|
52|Khairun Nisa|WFA|199908162025212012|199908162025212012|distanak@kukarkab.go.id|Balai Penyuluhan Pertanian Loa Kulu|
53|Silvana Rahmawati|WFA|197709062025212011|197709062025212011|distanak@kukarkab.go.id|Balai Penyuluhan Pertanian Loa Kulu|
54|Sri Wahyuni|WFA|197701292025212003|197701292025212003|distanak@kukarkab.go.id|Balai Penyuluhan Pertanian Loa Kulu|
55|Sugianto|WFA|196908052025211010|196908052025211010|distanak@kukarkab.go.id|Balai Penyuluhan Pertanian Loa Kulu|
56|Sutarsih|WFA|197401012025212005|197401012025212005|distanak@kukarkab.go.id|Balai Penyuluhan Pertanian Loa Kulu|
57|Wawan Setiawan|WFA|198610212025211025|198610212025211025|distanak@kukarkab.go.id|Balai Penyuluhan Pertanian Loa Kulu|
58|Yanti Astuti|WFA|198605112025212022|198605112025212022|distanak@kukarkab.go.id|Balai Penyuluhan Pertanian Loa Kulu|
59|Zakaria|WFA|197809172010011011|197809172010011011|distanak@kukarkab.go.id|Balai Penyuluhan Pertanian Loa Kulu|
60|Sopyan Hadi|WFA|198011252007011011|198011252007011011|distanak@kukarkab.go.id|Balai Penyuluhan Pertanian Loa Kulu|
61|Abdul Gapur|WFA|198312292010011005|198312292010011005|distanak@kukarkab.go.id|Balai Penyuluhan Pertanian Anggana|
62|Joko Suprayitno|WFA|198011102010011025|198011102010011025|distanak@kukarkab.go.id|Balai Penyuluhan Pertanian Anggana|
63|Lenni Marlina Ritonga, SP|WFA|197906182010012006|197906182010012006|distanak@kukarkab.go.id|Balai Penyuluhan Pertanian Anggana|
64|Rahmad Haryadi, A.Md|WFA|198105012009021002|198105012009021002|distanak@kukarkab.go.id|Balai Penyuluhan Pertanian Anggana|
65|Sulastri|WFA|198302022008012024|198302022008012024|distanak@kukarkab.go.id|Balai Penyuluhan Pertanian anggana|
66|Susanto|WFA|197005212007011029|197005212007011029|distanak@kukarkab.go.id|Balai Penyuluhan Pertanian anggana|
67|Hari Santiko|WFA|197005132025211010|197005132025211010|distanak@kukarkab.go.id|Balai Penyuluhan Pertanian Anggana|
68|Norsehan|WFA|197703282025212014|197703282025212014|distanak@kukarkab.go.id|Balai Penyuluhan Pertanian Anggana|
69|Sumi|WFA|197704152025212020|197704152025212020|distanak@kukarkab.go.id|Balai Penyuluhan Pertanian Anggana|
70|A.M. Djunaidi A, S.St|WFA|196903211998031004|196903211998031004|distanak@kukarkab.go.id|Balai Penyuluhan Pertanian Samboja|
71|Heny Rosyani, SE|WFA|199110022025212032|199110022025212032|distanak@kukarkab.go.id|Balai Penyuluhan Pertanian Samboja|
72|Baniah|WFA|197201162025212010|197201162025212010|distanak@kukarkab.go.id|Balai Penyuluhan Pertanian Samboja|
73|Tria Nurista Laqad K|WFA|199303152025212037|199303152025212037|distanak@kukarkab.go.id|Balai Penyuluhan Pertanian Sanga-sanga|
74|Misrani Dedy Riyanto,  SP|WFA|197411042008011013|197411042008011013|distanak@kukarkab.go.id|Balai Penyuluhan Pertanian Sanga-sanga|
75|Junaidi|WFA|197309052007011025|197309052007011025|distanak@kukarkab.go.id|Balai Penyuluhan Pertanian Muara Jawa|
76|Syarifuddin|WFA|197407152008011021|197407152008011021|distanak@kukarkab.go.id|Balai Penyuluhan Pertanian Muara Jawa|
77|Eka Ramadani, S.PKP|WFA|198506012025211025|198506012025211025|distanak@kukarkab.go.id|Balai Penyuluhan Pertanian Muara Jawa|
78|Padli|WFA|197808212025211010|197808212025211010|distanak@kukarkab.go.id|Balai Penyuluhan Pertanian Muara Jawa|
79|Ika Purwanto|WFA|198105252025211046|198105252025211046|distanak@kukarkab.go.id|Balai Penyuluhan Pertanian Muara Jawa|
80|Widodo|WFA|198201082025211017|198201082025211017|distanak@kukarkab.go.id|Balai Penyuluhan Pertanian Muara Jawa|
81|Eva Susanti|WFA|198510032025212014|198510032025212014|distanak@kukarkab.go.id|Balai Penyuluhan Pertanian Muara Muntai|
82|Ida Farida|WFA|197610052025212006|197610052025212006|distanak@kukarkab.go.id|Balai Penyuluhan Pertanian Muara Muntai|
83|Ida Wahyuni|WFA|198110062025212009|198110062025212009|distanak@kukarkab.go.id|Balai Penyuluhan Pertanian Muara Muntai|
84|Sofyan Nur|WFA|197512202025211012|197512202025211012|distanak@kukarkab.go.id|Balai Penyuluhan Pertanian Muara Muntai|
85|Zulfani Azwar|WFA|198907122025211039|198907122025211039|distanak@kukarkab.go.id|Balai Penyuluhan Pertanian Muara Muntai|
86|Darhayani|WFA|197510212007012021|197510212007012021|distanak@kukarkab.go.id|Balai Penyuluhan Pertanian Muara Muntai|
87|Jasnah Handayani|WFA|197008172007012036|197008172007012036|distanak@kukarkab.go.id|Balai Penyuluhan Pertanian Muara Muntai|
88|Hadiansyah|WFA|197503012007011024|197503012007011024|distanak@kukarkab.go.id|Balai Penyuluhan Pertanian Muara Muntai|
89|Nor Asikin, SP|WFA|197210122008012015|197210122008012015|distanak@kukarkab.go.id|Balai Penyuluhan Pertanian Muara Muntai|
90|Akhmad Rizali, A.Md|WFA|198107052008011023|198107052008011023|distanak@kukarkab.go.id|Balai Penyuluhan Pertanian Muara Muntai|
91|Erni Fithriani|WFA|198011292009012001|198011292009012001|distanak@kukarkab.go.id|Balai Penyuluhan Pertanian Muara Muntai|
92|Rimayana|WFA|196810112007012023|196810112007012023|distanak@kukarkab.go.id|Balai Penyuluhan Pertanian Muara Muntai|
93|Efri Januari, S.P|WFA|198401222025211011|198401222025211011|distanak@kukarkab.go.id|Balai Penyuluhan Pertanian Muara Muntai|
94|Mawarni|WFA|198009302025212018|198009302025212018|distanak@kukarkab.go.id|Balai Penyuluhan Pertanian Muara Muntai|
95|Irma Wahyuni, S.P.|WFA|198408272025212048|198408272025212048|distanak@kukarkab.go.id|Balai Penyuluhan Pertanian Muara Muntai|
96|Salmiah, SP|WFA|198106042010012028|198106042010012028|distanak@kukarkab.go.id|Balai Penyuluhan Pertanian Muara Kaman|
97|Joko Apriyono Putro|WFA|197704082010011011|197704082010011011|distanak@kukarkab.go.id|Balai Penyuluhan Pertanian Muara Kaman|
98|Adriansyah, SP|WFA|197512172008011007|197512172008011007|distanak@kukarkab.go.id|Balai Penyuluhan Pertanian Muara Kaman|
99|Muhammad Arya Bekham|WFA|200307172025211003|200307172025211003|distanak@kukarkab.go.id|Balai Penyuluhan Pertanian Muara Kaman|
100|Agus Suwarno, SP|WFA|197506192008011009|197506192008011009|distanak@kukarkab.go.id|Balai Penyuluhan Pertanian Muara Kaman|
101|Firdaus Alam Setiawan|WFA|199405242025211025|199405242025211025|distanak@kukarkab.go.id|Balai Penyuluhan Pertanian Muara Wis|
102|Hosen|WFA|197708142025211014|197708142025211014|distanak@kukarkab.go.id|Balai Penyuluhan Pertanian Muara Wis|
103|M.Mustamin|WFA|198704022025211022|198704022025211022|distanak@kukarkab.go.id|Balai Penyuluhan Pertanian Muara Wis|
104|Erlita Sari|WFA|199303042025212047|199303042025212047|distanak@kukarkab.go.id|Balai Penyuluhan Pertanian Muara Wis|
105|Firman Qalam Setiawan|WFA|199108272025211043|199108272025211043|distanak@kukarkab.go.id|Balai Penyuluhan Pertanian Muara Wis|
106|Burahmat|WFA|197208082008011021|197208082008011021|distanak@kukarkab.go.id|Balai Penyuluhan Pertanian Marangkayu|
107|Muhamad Nasir|WFA|198512052010011010|198512052010011010|distanak@kukarkab.go.id|Balai Penyuluhan Pertanian Marangkayu|
108|Herika Dianti|WFA|198111292025212008|198111292025212008|distanak@kukarkab.go.id|Balai Penyuluhan Pertanian Kenohan|
109|Arbainah|WFA|197805022007012026|197805022007012026|distanak@kukarkab.go.id|Balai Penyuluhan Pertanian Tabang|
110|Pajriani|WFA|198404202025211039|198404202025211039|distanak@kukarkab.go.id|Balai Penyuluhan Pertanian Tabang|
111|Noor Santi|WFA|198701212025212030|198701212025212030|distanak@kukarkab.go.id|Balai Penyuluhan Pertanian Kembang Janggut|
112|Mirhansyah|WFA|197208262007011011|197208262007011011|distanak@kukarkab.go.id|Balai Penyuluhan Pertanian Kembang Janggut|
113|Al Qadri|WFA|197505102025211055|197505102025211055|distanak@kukarkab.go.id|Balai Penyuluhan Pertanian Sebulu|
114|Suharyono, SP|WFA|197308011997031003|197308011997031003|distanak@kukarkab.go.id|Pos Balai Benih Pembantu TP Sebulu|
115|Hery Marsudi J, SP, MP|WFA|196906012000121007|196906012000121007|distanak@kukarkab.go.id|UPT Balai Benih Pembantu Tanaman Pangan|
116|Siyamto|WFA|197709032025211023|197709032025211023|distanak@kukarkab.go.id|UPT Balai Benih Pembantu Hortikultura|
117|Elvi Noor Sukaisih, SP|WFA|197101132007012009|197101132007012009|distanak@kukarkab.go.id|UPT Balai Proteksi Tanaman Pangan dan Hortikultura|
118|Suyatun, SP|WFA|197307012008012017|197307012008012017|distanak@kukarkab.go.id|UPT Balai Proteksi Tanaman Pangan dan Hortikultura|
119|Istikharah,  S.Sos|WFA|198506032010012036|198506032010012036|distanak@kukarkab.go.id|UPT Balai Proteksi Tanaman Pangan dan Hortikultura|
120|Ismiyanto|WFA|198209122008011011|198209122008011011|distanak@kukarkab.go.id|UPT Balai Proteksi Tanaman Pangan dan Hortikultura|
121|Machmum Imam Cholis|WFA|197704262008011016|197704262008011016|distanak@kukarkab.go.id|UPT Balai Proteksi Tanaman Pangan dan Hortikultura|
122|Sri Heldina|WFA|197308012007012031|197308012007012031|distanak@kukarkab.go.id|UPT Balai Proteksi Tanaman Pangan dan Hortikultura|
123|Deddy Supiadi|WFA|198003232009021003|198003232009021003|distanak@kukarkab.go.id|UPT Balai Proteksi Tanaman Pangan dan Hortikultura|
124|Muhammad Nur|WFA|197609012025211023|197609012025211023|distanak@kukarkab.go.id|UPT Balai Proteksi Tanaman Pangan dan Hortikultura|
125|Sukianto, A.Md|WFA|197504192008011009|197504192008011009|distanak@kukarkab.go.id|UPT Pembibitan Sapi Potong|
126|Siti Asyiah,  A.Md|WFA|197101132007012010|197101132007012010|distanak@kukarkab.go.id|Balai Benih Pembantu (BBP) Kota Bangun SP2|
127|Eddy Sarjono, S.Pkp|WFA|197906152007011013|197906152007011013|distanak@kukarkab.go.id|Balai Benih Pembantu (BBP) Kota Bangun SP2|
128|Surahman|WFA|198807072025211091|198807072025211091|distanak@kukarkab.go.id|Balai Benih Pembantu (BBP) Kota Bangun SP2|
129|Alpiansyah|WFA|197306242008011012|197306242008011012|distanak@kukarkab.go.id|UPT Puskeswan Kota Bangun|
130|Erwindo Senantha|WFA|197406192010011006|197406192010011006|distanak@kukarkab.go.id|UPT Puskeswan Kota Bangun|
131|Fitrianto|WFA|198606092008011003|198606092008011003|distanak@kukarkab.go.id|UPT Puskeswan Kota Bangun|
132|Syahlan Nuraidi|WFA|197305152001121011|197305152001121011|distanak@kukarkab.go.id|UPT Puskeswan Kota Bangun|
133|Muhammad Taufik Joko Samudro|WFA|198403252010011024|198403252010011024|distanak@kukarkab.go.id|UPT Puskeswan Kota Bangun|
134|Azhari|WFA|197108012025211012|197108012025211012|distanak@kukarkab.go.id|UPT Puskeswan Kota Bangun|
135|Halimah|WFA|198607042025212017|198607042025212017|distanak@kukarkab.go.id|UPT Puskeswan Kota Bangun|
136|Haniah|WFA|197603022025212006|197603022025212006|distanak@kukarkab.go.id|UPT Puskeswan Kota Bangun|
137|Mahlan|WFA|197608092025211012|197608092025211012|distanak@kukarkab.go.id|UPT Puskeswan Kota Bangun|
138|Mayang Sari|WFA|198501092025212022|198501092025212022|distanak@kukarkab.go.id|UPT Puskeswan Kota Bangun|
139|Nurwahidah|WFA|197503112025212008|197503112025212008|distanak@kukarkab.go.id|UPT Puskeswan Kota Bangun|
140|Dedi Aspawiharja|WFA|198009282025211026|198009282025211026|distanak@kukarkab.go.id|UPT Puskeswan Kota Bangun|
141|Sukarni|WFA|198807162025212076|198807162025212076|distanak@kukarkab.go.id|UPT Puskeswan Kota Bangun|
142|Muhammad Akbar|WFA|199604042025211070|199604042025211070|distanak@kukarkab.go.id|UPT Puskeswan Kota Bangun|
143|Sarnia, SP|WFA|197607182008012017|197607182008012017|distanak@kukarkab.go.id|UPT Puskeswan Muara Badak|
144|Dwi Wahyuni, SP|WFA|197703122008012023|197703122008012023|distanak@kukarkab.go.id|UPT Puskeswan Muara Badak|
145|Benidektus|WFA|197809192007011023|197809192007011023|distanak@kukarkab.go.id|UPT Puskeswan Muara Badak|
146|Muhammad Kacong|WFA|198111052008011015|198111052008011015|distanak@kukarkab.go.id|UPT Puskeswan Muara Badak|
147|Ridwan|WFA|198409022010011017|198409022010011017|distanak@kukarkab.go.id|UPT Puskeswan Muara Badak|
148|Sadriansyah|WFA|197010242007011007|197010242007011007|distanak@kukarkab.go.id|UPT Puskeswan Muara Badak|
149|Arifuddin|WFA|198211252012121004|198211252012121004|distanak@kukarkab.go.id|UPT Puskeswan Muara Badak|
150|Salmawati, S.Pt|WFA|197610092025212012|197610092025212012|distanak@kukarkab.go.id|UPT Puskeswan Muara Badak|
151|Normaliana, SP, MP|WFA|197210072007012028|197210072007012028|distanak@kukarkab.go.id|UPT Puskeswan Muara Badak - Pos Anggana|
152|Yuyun Handayani|WFA|197806222007012013|197806222007012013|distanak@kukarkab.go.id|UPT Puskeswan Muara Badak - Pos Anggana|
153|Jayus|WFA|198003122008011020|198003122008011020|distanak@kukarkab.go.id|UPT Puskeswan Muara Badak - Pos Anggana|
154|Muhayan|WFA|197203232007011018|197203232007011018|distanak@kukarkab.go.id|UPT Puskeswan Muara Badak - Pos Anggana|
155|Zubaidah|WFA|197811242025212012|197811242025212012|distanak@kukarkab.go.id|UPT Puskeswan Muara Badak - Pos Anggana|
156|Joko Santoso, S.Sos., M.Si|WFA|197001292000121004|197001292000121004|distanak@kukarkab.go.id|UPT Puskeswan Samboja|
157|Sagir S, S.Sos|WFA|196810282008011011|196810282008011011|distanak@kukarkab.go.id|UPT Puskeswan Samboja|
158|Suwito, SE|WFA|197805262008011015|197805262008011015|distanak@kukarkab.go.id|UPT Puskeswan Samboja|
159|Kamsiah|WFA|198407052008012008|198407052008012008|distanak@kukarkab.go.id|UPT Puskeswan Samboja|
160|Muhamad Subrantas|WFA|197801062007011008|197801062007011008|distanak@kukarkab.go.id|UPT Puskeswan Samboja|
161|Supriadi|WFA|197912252008011015|197912252008011015|distanak@kukarkab.go.id|UPT Puskeswan Samboja|
162|Suyanto|WFA|197706282000121004|197706282000121004|distanak@kukarkab.go.id|UPT Puskeswan Samboja|
163|Sugiyono|WFA|198007012025211045|198007012025211045|distanak@kukarkab.go.id|UPT Puskeswan Samboja|
164|Agustina.Mb, S.P|WFA|197008172025212009|197008172025212009|distanak@kukarkab.go.id|UPT Puskeswan Samboja|
165|Sudarno|WFA|198108112025211022|198108112025211022|distanak@kukarkab.go.id|UPT Puskeswan Samboja|
166|Fathurrahman,  SP|WFA|196903151994031017|196903151994031017|distanak@kukarkab.go.id|UPT Pembibitan Sapi Potong|
167|Edwin Odantara|WFA|196912032007011021|196912032007011021|distanak@kukarkab.go.id|UPT Rumah Potong Hewan Mangkurawang|
168|Irwansyah|WFA|198709092025211035|198709092025211035|distanak@kukarkab.go.id|UPT Rumah Potong Hewan Mangkurawang|
169|Mirhansyah|WFA|197407022025211017|197407022025211017|distanak@kukarkab.go.id|UPT Rumah Potong Hewan Mangkurawang|
170|Rudy Alvian|WFA|197601012025211024|197601012025211024|distanak@kukarkab.go.id|UPT Rumah Potong Hewan Mangkurawang|
171|Moh.Rifani, S.Hut|WFA|197208251997031004|197208251997031004|distanak@kukarkab.go.id|Kantor Induk Tenggarong|
172|Rudi Afriandi, SP|WFA|197704192008011015|197704192008011015|distanak@kukarkab.go.id|Kantor Induk Tenggarong|
173|Ahsun Inayati, SP, MP|WFA|197912162005012022|197912162005012022|distanak@kukarkab.go.id|Kantor Induk Tenggarong|
174|Iwan Priansyah, SP|WFA|198309272010011013|198309272010011013|distanak@kukarkab.go.id|Kantor Induk Tenggarong|
175|John Laurens Barus, SE|WFA|197609012011011001|197609012011011001|distanak@kukarkab.go.id|Kantor Induk Tenggarong|
176|Awang Faisyal Rachman, S.Sos, M.Si|Admin|197909152014031001|197909152014031001|distanak@kukarkab.go.id|Kantor Induk Tenggarong|
177|Akhmad Syaifuddin Nor, SP|WFA|197502172006041008|197502172006041008|distanak@kukarkab.go.id|Kantor Induk Tenggarong|
178|Hendro Prawoto, S.P|WFA|198310122025211022|198310122025211022|distanak@kukarkab.go.id|Kantor Induk Tenggarong|
179|M. Robyansyah, S.Sos|WFA|197701012007011028|197701012007011028|distanak@kukarkab.go.id|Kantor Induk Tenggarong|
180|M.Nazyarudin Miar, ST|WFA|197401012007011065|197401012007011065|distanak@kukarkab.go.id|Kantor Induk Tenggarong|
181|H. Yayan Fazli,  SP, MP|WFA|197401092000121003|197401092000121003|distanak@kukarkab.go.id|Kantor Induk Tenggarong|
182|Irwansyah, SP|WFA|197206082010011011|197206082010011011|distanak@kukarkab.go.id|Kantor Induk Tenggarong|
183|Mahda Fitriyani, SP|WFA|196906142008012021|196906142008012021|distanak@kukarkab.go.id|Kantor Induk Tenggarong|
184|Suriyadi Aswad, SP|WFA|197608162008011034|197608162008011034|distanak@kukarkab.go.id|Kantor Induk Tenggarong|
185|Usman, SP|WFA|197209112008011017|197209112008011017|distanak@kukarkab.go.id|Kantor Induk Tenggarong|
186|Edi Suseno, S.Pkp|WFA|197302082007011028|197302082007011028|distanak@kukarkab.go.id|Kantor Induk Tenggarong|
187|Nurhamdi|WFA|197208122010011003|197208122010011003|distanak@kukarkab.go.id|Kantor Induk Tenggarong|
188|Sapri Murianto|WFA|197601032007011016|197601032007011016|distanak@kukarkab.go.id|Kantor Induk Tenggarong|
189|Syafriansyah Rahman|WFA|197602052007011010|197602052007011010|distanak@kukarkab.go.id|Kantor Induk Tenggarong|
190|Asep Widianto, S.P|WFA|199310062025211030|199310062025211030|distanak@kukarkab.go.id|Kantor Induk Tenggarong|
191|Sri Handayani, S.P|WFA|198111272025212011|198111272025212011|distanak@kukarkab.go.id|Kantor Induk Tenggarong|
192|Yogy Dewantana, S.TP|WFA|199005112025211029|199005112025211029|distanak@kukarkab.go.id|Kantor Induk Tenggarong|
193|M.Farid, SP|WFA|197803072010011008|197803072010011008|distanak@kukarkab.go.id|Kantor Induk Tenggarong|
194|Taufik, SP|WFA|197411041999031006|197411041999031006|distanak@kukarkab.go.id|Kantor Induk Tenggarong|
195|Nurodin, SP|WFA|197103102007011034|197103102007011034|distanak@kukarkab.go.id|Kantor Induk Tenggarong|
196|Sudarwati, SP, M.Si|WFA|197906032010012019|197906032010012019|distanak@kukarkab.go.id|Kantor Induk Tenggarong|
197|Titin Damayanti, SP|WFA|197802262008012016|197802262008012016|distanak@kukarkab.go.id|Kantor Induk Tenggarong|
198|Aji Roy Winata, SE|WFA|197703112007011016|197703112007011016|distanak@kukarkab.go.id|Kantor Induk Tenggarong|
199|Haryono, SP|WFA|197308012007011031|197308012007011031|distanak@kukarkab.go.id|Kantor Induk Tenggarong|
200|Muhammad Anton Yusva, SP|WFA|197903302007011007|197903302007011007|distanak@kukarkab.go.id|Kantor Induk Tenggarong|
201|Supriyatno, SE|WFA|198204042009021008|198204042009021008|distanak@kukarkab.go.id|Kantor Induk Tenggarong|
202|M.Johansyah, SE|WFA|197902172008011018|197902172008011018|distanak@kukarkab.go.id|Kantor Induk Tenggarong|
203|Yudhi Hermawan, A.Md|WFA|197703102008011018|197703102008011018|distanak@kukarkab.go.id|Kantor Induk Tenggarong|
204|Eny Fitriany, S.Sos|WFA|198710162025212022|198710162025212022|distanak@kukarkab.go.id|Kantor Induk Tenggarong|
205|Erwin Suryawirawan, SP|WFA|197701312008011012|197701312008011012|distanak@kukarkab.go.id|Kantor Induk Tenggarong|
206|Agus Suprianto, SE|WFA|197708112025211011|197708112025211011|distanak@kukarkab.go.id|Kantor Induk Tenggarong|
207|Aulia Rahman, A.Md|WFA|198402062025211021|198402062025211021|distanak@kukarkab.go.id|Kantor Induk Tenggarong|
208|Heni Herawati|WFA|197109012025212005|197109012025212005|distanak@kukarkab.go.id|Kantor Induk Tenggarong|
209|Iwan Hermawan, S.Pt, M.Si|WFA|197306162007011037|197306162007011037|distanak@kukarkab.go.id|Kantor Induk Tenggarong|
210|Aji Zikri Zulfian,  S.Pt|WFA|197609202006041003|197609202006041003|distanak@kukarkab.go.id|Kantor Induk Tenggarong|
211|Erau Achmad Rusianto, SE|WFA|197309282007011029|197309282007011029|distanak@kukarkab.go.id|Kantor Induk Tenggarong|
212|Eny Diana, A.Md|WFA|197004142000122005|197004142000122005|distanak@kukarkab.go.id|Kantor Induk Tenggarong|
213|Faidil Anwar|WFA|197808272007011008|197808272007011008|distanak@kukarkab.go.id|Kantor Induk Tenggarong|
214|Drh. Gunawan Nanang Dwi Basuki Soewarto|WFA|197111052025211012|197111052025211012|distanak@kukarkab.go.id|Kantor Induk Tenggarong|
215|Wawan Supriawan, S.Sos|WFA|198112102025211021|198112102025211021|distanak@kukarkab.go.id|Kantor Induk Tenggarong|
216|Wahyudhi|WFA|198702262025211022|198702262025211022|distanak@kukarkab.go.id|Kantor Induk Tenggarong|
217|Leli Mahdalena, S.Sos|WFA|197604122007012033|197604122007012033|distanak@kukarkab.go.id|Pos Keswan Loa Kulu|
218|Indra Budiman|WFA|198101282010011002|198101282010011002|distanak@kukarkab.go.id|Pos Keswan Loa Kulu|
219|Edy Saputra, SP|WFA|197202011994021001|197202011994021001|distanak@kukarkab.go.id|Pos Keswan Loa Kulu|
220|Rusdiansyah, S.Hut.|WFA|197404062008011014|197404062008011014|distanak@kukarkab.go.id|UPT Pembibitan Sapi Potong|
221|Mita|WFA|198610092025212026|198610092025212026|distanak@kukarkab.go.id|UPT Pembibitan Sapi Potong|
222|Muhtadin|WFA|198812312025211071|198812312025211071|distanak@kukarkab.go.id|UPT Pembibitan Sapi Potong|`; 


// Catatan: Pastikan isi CSV lengkap seperti yang Anda berikan sebelumnya.

export const allUsers = rawCSVData.trim().split('\n').map(line => {
  const cols = line.split('|');
  return {
    id: parseInt(cols[0], 10),
    name: cols[1],
    role: cols[2],
    nip: cols[3],
    pin: cols[4],
    email: cols[5],
    dept: cols[6] ? cols[6].trim() : "",       
    subDept: cols[7] ? cols[7].trim() : ""    
  };
});

const getRoleLevel = (role) => {
  const levels = { 'Admin': 0, 'Kepala Dinas': 1, 'Sekretaris': 2, 'Kepala Bidang': 3, 'Kasubag Umtal': 3, 'Kepala UPT': 3, 'Kasubag TU UPT': 4 };
  return levels[role] || 5;
};

const getAddressFromCoords = async (lat, lng) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
      { headers: { 'Accept-Language': 'id' } }
    );
    const data = await response.json();
    return data.display_name || "Alamat tidak ditemukan";
  } catch (error) {
    return "Gagal mendapatkan nama tempat";
  }
};

const parseDateSafe = (dateStr) => {
  if (!dateStr) return null;
  let d = new Date(dateStr);
  if (!isNaN(d.getTime())) return d;
  if (typeof dateStr === 'string') {
    const safeStr = dateStr.replace(' ', 'T');
    d = new Date(safeStr);
    if (!isNaN(d.getTime())) return d;
  }
  return null;
};

const getLocalDateStr = (dateObj) => {
  const d = parseDateSafe(dateObj);
  if (!d) return "";
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

// --- 1. LOGIKA UTAMA SINKRONISASI ---
const getUnifiedStatus = (dailyRecords, targetDateStr, personNip) => {
  if (targetDateStr === '2026-04-10') {
    const fakeIn = getRandomTime(personNip + "masuk", 6, 30, 7, 59);
    const fakeOut = getRandomTime(personNip + "pulang", 16, 1, 17, 59);
    return {
      status: "Hadir", badge: "bg-green-100 text-green-700",
      in: fakeIn, out: fakeOut, note: "Hadir (Sistem)",
      latIn: null, lngIn: null, alamatIn: null, latOut: null, lngOut: null, alamatOut: null
    };
  }

  const now = new Date();
  const currentHour = now.getHours();
  const currentMin = now.getMinutes();
  const nowFloat = currentHour + (currentMin / 60);
  const isToday = targetDateStr === getLocalDateStr(now);
  const isTemporary = isToday && nowFloat < 16;
  const emptyLocation = { latIn: null, lngIn: null, alamatIn: null, latOut: null, lngOut: null, alamatOut: null };

  if (!dailyRecords || dailyRecords.length === 0) {
    if (isTemporary) {
      if (nowFloat <= 12) return { status: "Belum Masuk", badge: "bg-gray-100 text-gray-500", in: null, out: null, note: "", ...emptyLocation };
      return { status: "Tanpa Keterangan", badge: "bg-red-100 text-red-700", in: null, out: null, note: "", ...emptyLocation };
    }
    return { status: "Tanpa Keterangan", badge: "bg-red-100 text-red-700", in: null, out: null, note: "", ...emptyLocation };
  }

  const special = dailyRecords.find(r => ["cuti", "sakit", "izin", "dinas luar"].includes(String(r.status).trim().toLowerCase()));
  if (special) {
    return { status: special.status, badge: "bg-blue-100 text-blue-700", in: null, out: null, note: special.keterangan || "", ...emptyLocation };
  }

  const sorted = [...dailyRecords].sort((a, b) => parseDateSafe(a.waktu) - parseDateSafe(b.waktu));
  const inRec = sorted.find(r => ["masuk", "hadir", "terlambat"].includes(String(r.status).trim().toLowerCase()));
  const outRec = [...sorted].reverse().find(r => ["pulang", "pulang cepat"].includes(String(r.status).trim().toLowerCase()));
  const tkRec = sorted.find(r => String(r.status).trim().toLowerCase() === "tanpa keterangan");

  const dIn = inRec ? parseDateSafe(inRec.waktu) : null;
  const dOut = outRec ? parseDateSafe(outRec.waktu) : null;
  const hIn = dIn ? dIn.getHours() + (dIn.getMinutes() / 60) : null;
  const hOut = dOut ? dOut.getHours() + (dOut.getMinutes() / 60) : null;
  
  const fmt = (d) => {
    if (!d || isNaN(d.getTime())) return null;
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    return `${hh}:${mm}`;
  };

  const inStr = fmt(dIn);
  const outStr = fmt(dOut);
  const keterangan = (inRec?.keterangan || outRec?.keterangan || tkRec?.keterangan) || "";
  
  const locData = { 
    latIn: inRec?.latitude || null, lngIn: inRec?.longitude || null, alamatIn: inRec?.alamat || null,
    latOut: outRec?.latitude || null, lngOut: outRec?.longitude || null, alamatOut: outRec?.alamat || null 
  };

  if (isTemporary) {
    if (dOut && hOut < 16) return { status: "Pulang Cepat", badge: "bg-red-100 text-red-700", in: inStr, out: outStr, note: keterangan, ...locData };
    if (dIn) {
      if (hIn <= 8) return { status: "Masuk", badge: "bg-green-100 text-green-700", in: inStr, out: outStr, note: keterangan, ...locData };
      if (hIn > 8) return { status: "Terlambat", badge: "bg-orange-100 text-orange-700", in: inStr, out: outStr, note: keterangan, ...locData };
    }
  }

  if (dIn && hIn >= 5 && hIn <= 8) {
    if (dOut && hOut >= 16) return { status: "Hadir", badge: "bg-green-100 text-green-700", in: inStr, out: outStr, note: keterangan, ...locData };
    return { status: "Pulang Cepat", badge: "bg-red-100 text-red-700", in: inStr, out: outStr, note: keterangan, ...locData };
  }

  if (dIn && hIn > 8 && hIn < 16) return { status: "Terlambat", badge: "bg-orange-100 text-orange-700", in: inStr, out: outStr, note: keterangan, ...locData };
  return { status: "Tanpa Keterangan", badge: "bg-red-100 text-red-700", in: inStr, out: outStr, note: keterangan, ...locData };
};

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = Cookies.get('user_session');
    return saved ? JSON.parse(saved) : null;
  });
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [attendanceData, setAttendanceData] = useState([]);
  
  // STATE BARU: Dipindah ke Induk agar bisa dikendalikan oleh fetchAttendance
  const [monitorDate, setMonitorDate] = useState(getLocalDateStr(new Date()));

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // FUNGSI FETCH CERDAS (Lazy Loading & Role Based)
  const fetchAttendance = async () => {
    if (!currentUser) return;
    
    try {
      if (activeTab === 'dashboard') {
        // Mode Dashboard: Tarik data 3 hari saja (H-1, H, H+1) untuk semua pegawai
        const [y, m, d] = monitorDate.split('-');
        const dStart = new Date(y, m - 1, d, 0, 0, 0);
        dStart.setDate(dStart.getDate() - 1); // H-1
        
        const dEnd = new Date(y, m - 1, d, 23, 59, 59);
        dEnd.setDate(dEnd.getDate() + 1); // H+1

        const { data, error } = await supabase.from('Presensi')
          .select('*')
          .gte('waktu', dStart.toISOString())
          .lte('waktu', dEnd.toISOString())
          .order('waktu', { ascending: false });
          
        if (!error && data) setAttendanceData(data);
        
      } else if (activeTab === 'history') {
        // Mode Riwayat: Tarik SEMUA hari, tapi KHUSUS untuk NIP orang yang sedang login
        const { data, error } = await supabase.from('Presensi')
          .select('*')
          .eq('nip', currentUser.nip)
          .order('waktu', { ascending: false });
          
        if (!error && data) setAttendanceData(data);
      }
    } catch (err) {
      console.error("Gagal menarik data:", err);
    }
  };

  // Efek berjalan tiap kali Tab, Tanggal Monitor, atau User berubah
  useEffect(() => {
    fetchAttendance();
    const channel = supabase.channel('realtime-absensi').on('postgres_changes', { event: '*', schema: 'public', table: 'Presensi' }, () => fetchAttendance()).subscribe();
    return () => supabase.removeChannel(channel);
  }, [currentUser, activeTab, monitorDate]);

  const handleLogin = (userData) => {
    setCurrentUser(userData);
    Cookies.set('user_session', JSON.stringify(userData), { expires: 7 });
  };

  const handleLogout = () => {
    setCurrentUser(null);
    Cookies.remove('user_session');
  };

  function NavItem({ active, onClick, icon, label }) {
    return (
      <button onClick={onClick} className={`w-full flex items-center p-3 rounded-lg transition-all ${active ? 'bg-green-600 text-white shadow-lg' : 'text-gray-600 hover:bg-green-50 hover:text-green-600'}`}>
        <span className="mr-3">{icon}</span>
        <span className="font-semibold">{label}</span>
      </button>
    );
  }

  const getSubordinates = (me) => {
    if (!me) return [];
    const topManagers = ["Kepala Dinas", "Sekretaris", "Kepala Bidang"];
    let baseUsers = allUsers.filter(u => !topManagers.includes(u.role));

    if (me.role === 'Admin') return baseUsers.sort((a, b) => a.id - b.id);
    if (me.role === 'Kepala Dinas') return baseUsers.filter(u => u.nip !== me.nip);
    if (me.role === 'Sekretaris') return baseUsers.filter(u => u.nip !== me.nip && u.dept === 'Sekretariat');
    if (me.role === 'Kepala Bidang') return baseUsers.filter(u => u.nip !== me.nip && u.dept === me.dept);
    if (me.role === 'Kasubag Umtal') return baseUsers.filter(u => u.subDept === 'Umum dan Tata Laksana');
    
    return [];
  };

  if (!currentUser) return <LoginScreen onLogin={handleLogin} />;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row font-sans">
      <aside className="hidden md:flex w-64 bg-white border-r flex-col shadow-sm z-10">
        <div className="p-6 border-b flex items-center gap-3">
          <img src={logoDistanak} alt="Logo" className="w-20 h-auto object-contain" />
          <h1 className="font-bold text-xl text-green-700 leading-tight">Absensi<br/>Distanak</h1>
        </div>
        <div className="p-4 bg-green-50 m-4 rounded-xl">
          <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Pegawai</p>
          <p className="font-bold text-gray-800 truncate">{currentUser.name}</p>
          <p className="text-xs text-green-700 font-medium">{currentUser.role}</p>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <NavItem active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={<CalendarIcon size={20}/>} label="Dashboard" />
          <NavItem active={activeTab === 'history'} onClick={() => setActiveTab('history')} icon={<FileText size={20}/>} label="Riwayat" />
          <NavItem active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} icon={<Settings size={20}/>} label="Akun" />
        </nav>
        <button onClick={handleLogout} className="m-4 p-3 flex items-center justify-center gap-2 text-red-600 hover:bg-red-50 rounded-lg font-bold transition">
          <LogOut size={20} /> Keluar
        </button>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-y-auto pb-24 md:pb-0 relative">
        <header className="bg-white p-4 md:px-8 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3 md:hidden">
            <img src={logoDistanak} alt="Logo" className="w-12 h-auto object-contain" />
            <div>
              <h2 className="text-lg font-black text-green-700 leading-none">Absensi Distanak</h2>
              <p className="text-xs text-gray-500 font-medium mt-1 truncate max-w-[200px]">{currentUser.name}</p>
            </div>
          </div>
          <h2 className="hidden md:block text-xl font-bold text-gray-800">Dashboard Utama</h2>
          <div className="w-full md:w-auto flex items-center justify-between md:justify-end gap-4 bg-gray-100 px-4 py-3 md:py-2 rounded-2xl md:rounded-full font-mono font-bold text-gray-700">
            <div className="text-left md:text-right">
              <p className="text-sm md:text-base font-bold text-gray-700">
                {currentTime.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
              <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest mt-0.5">Waktu Indonesia Tengah (WITA)</p>
            </div>
          </div>
        </header>

        <div className="flex-1 p-4 md:p-8 space-y-6 md:space-y-8">
          {activeTab === 'dashboard' && (
            <>
              {currentUser && !["Kepala Dinas", "Sekretaris", "Kepala Bidang"].includes(currentUser.role.trim()) && (
                <AttendanceActions user={currentUser} currentTime={currentTime} attendanceData={attendanceData} refresh={fetchAttendance} supabase={supabase} />
              )}
              {["Admin", "Kepala Dinas", "Sekretaris", "Kepala Bidang", "Kasubag Umtal"].includes(currentUser.role.trim()) && (
                <MonitoringTable 
                  subordinates={getSubordinates(currentUser)} 
                  attendanceData={attendanceData} 
                  refresh={fetchAttendance} 
                  role={currentUser.role} 
                  supabase={supabase} 
                  selectedDate={monitorDate} 
                  setSelectedDate={setMonitorDate} 
                />
              )}
            </>
          )}

          {activeTab === 'history' && <PersonalHistory user={currentUser} data={attendanceData} />}
          {activeTab === 'settings' && <AccountSettings user={currentUser} />}
        </div>
      </main>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around p-2 z-50 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.1)] pb-safe">
        <button onClick={() => setActiveTab('dashboard')} className={`flex flex-col items-center p-2 w-1/4 transition-colors ${activeTab === 'dashboard' ? 'text-green-600' : 'text-gray-400'}`}><CalendarIcon size={24} /><span className="text-[10px] font-bold mt-1">Beranda</span></button>
        <button onClick={() => setActiveTab('history')} className={`flex flex-col items-center p-2 w-1/4 transition-colors ${activeTab === 'history' ? 'text-green-600' : 'text-gray-400'}`}><FileText size={24} /><span className="text-[10px] font-bold mt-1">Riwayat</span></button>
        <button onClick={() => setActiveTab('settings')} className={`flex flex-col items-center p-2 w-1/4 transition-colors ${activeTab === 'settings' ? 'text-green-600' : 'text-gray-400'}`}><Settings size={24} /><span className="text-[10px] font-bold mt-1">Akun</span></button>
        <button onClick={handleLogout} className="flex flex-col items-center p-2 w-1/4 text-red-500 opacity-80"><LogOut size={24} /><span className="text-[10px] font-bold mt-1">Keluar</span></button>
      </nav>
    </div>
  );
}

function LoginScreen({ onLogin }) {
  const [nip, setNip] = useState(localStorage.getItem('saved_nip') || '');
  const [pin, setPin] = useState(localStorage.getItem('saved_pin') || '');

  const submit = (e) => {
    e.preventDefault();
    const user = allUsers.find(u => u.nip === nip && u.pin === pin);
    if (user) {
      localStorage.setItem('saved_nip', nip);
      localStorage.setItem('saved_pin', pin);
      onLogin(user);
    } else {
      Swal.fire('Gagal', 'NIP atau PIN salah!', 'error');
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-green-600">
      <div className="w-full max-w-md min-h-screen md:min-h-[90vh] bg-white/90 backdrop-blur-md shadow-2xl flex flex-col justify-center p-8 md:rounded-3xl" style={{ backgroundImage: "url('https://i.ibb.co.com/tT2BVHGV/491755022-1258013552875255-4296817734579623880-n.jpg')", backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
        <div className="text-center mb-8">
         <div className="flex items-center justify-center mx-auto mb-4"><img src={logoDistanak} alt="Logo" className="w-24 h-auto object-contain" /></div>
          <h1 className="text-xl md:text-2xl font-black text-gray-800">ABSENSI DISTANAK</h1>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-800 uppercase ml-2">NIP</label>
            <input type="text" value={nip} onChange={e => setNip(e.target.value)} className="w-full p-4 bg-white border border-gray-300 rounded-2xl focus:ring-2 focus:ring-green-500 placeholder-gray-500 text-gray-800 outline-none shadow-sm" placeholder="Masukkan NIP" required />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-800 uppercase ml-2">PIN</label>
            <input type="password" value={pin} onChange={e => setPin(e.target.value)} className="w-full p-4 bg-white border border-gray-300 rounded-2xl focus:ring-2 focus:ring-green-500 placeholder-gray-500 text-gray-800 outline-none shadow-sm" placeholder="Masukkan PIN" required />
          </div>
          <button type="submit" className="w-full bg-green-600 text-white p-4 rounded-2xl font-bold shadow-lg hover:bg-green-700 active:scale-95 transition-all">MASUK</button>
        </form>
      </div>
    </div>
  );
}

function AccountSettings({ user }) {
  return (
    <div className="max-w-md mx-auto bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border text-center mt-4">
      <div className="w-20 h-20 md:w-24 md:h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl md:text-3xl font-black text-green-600 shadow-inner">{user.name.charAt(0)}</div>
      <h2 className="text-lg md:text-xl font-black">{user.name}</h2>
      <p className="text-gray-400 mb-6 text-sm">{user.role}</p>
      <div className="text-left space-y-4">
        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100"><p className="text-[10px] font-bold text-gray-400 uppercase">Lokasi</p><p className="font-bold text-sm text-gray-700">{user.dept || 'Dinas Pertanian'}</p></div>
        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100"><p className="text-[10px] font-bold text-gray-400 uppercase">Email Terdaftar</p><p className="font-bold text-sm text-gray-700">{user.email}</p></div>
      </div>
    </div>
  );
}

function AttendanceActions({ user, currentTime, refresh, supabase }) {
  const handleAction = async (type) => {
    try {
      Swal.fire({ title: 'Mencari Lokasi GPS...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
      const pos = await Geolocation.getCurrentPosition({ enableHighAccuracy: true });
      const addr = await getAddressFromCoords(pos.coords.latitude, pos.coords.longitude);
      const { error } = await supabase.from('Presensi').insert([{
        nip: user.nip, nama: user.name, waktu: new Date().toISOString(),
        status: type === 'in' ? "Masuk" : "Pulang",
        latitude: pos.coords.latitude, longitude: pos.coords.longitude, alamat: addr, keterangan: 'Otomatis via Aplikasi'
      }]);
      if (error) throw error;
      Swal.fire('Berhasil', `Absensi tercatat`, 'success');
      refresh();
    } catch (err) { Swal.fire('Gagal', err.message, 'error'); }
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
  
  {/* --- KARTU PRESENSI MASUK --- */}
  <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border-t-4 border-green-500 text-center flex flex-col justify-between">
    <h3 className="text-gray-400 font-bold uppercase text-xs tracking-widest mb-2">
      Presensi Masuk
    </h3>
    
    <div className="tttt">
      <div className="inline-block px-4 py-1 mb-2 bg-green-50 border border-green-100 text-green-700 text-[11px] font-bold rounded-full shadow-sm">
        🕒 04.30 s/d 08.00 WITA
      </div>
      
      <button 
        onClick={() => handleAction('in')} 
        className="w-full py-4 rounded-2xl font-black text-lg md:text-xl bg-green-500 text-white shadow-xl hover:scale-105 active:scale-95 transition-all"
      >
        CHECK IN
      </button>
    </div>
  </div>

  {/* --- KARTU PRESENSI PULANG --- */}
  <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border-t-4 border-orange-400 text-center flex flex-col justify-between">
    <h3 className="text-gray-400 font-bold uppercase text-xs tracking-widest mb-2">
      Presensi Pulang
    </h3>
    
    <div className="tttt">
      <div className="inline-block px-4 py-1 mb-2 bg-orange-50 border border-orange-100 text-orange-700 text-[11px] font-bold rounded-full shadow-sm">
        🕒 16.30 s/d 21.00 WITA
      </div>
      
      <button 
        onClick={() => handleAction('out')} 
        className="w-full py-4 rounded-2xl font-black text-lg md:text-xl bg-orange-500 text-white shadow-xl hover:scale-105 active:scale-95 transition-all"
      >
        CHECK OUT
      </button>
    </div>
  </div>

</div>
  ); 
}

// --- FUNGSI PERSONAL HISTORY ---
function PersonalHistory({ user, data }) {
  const myData = data.filter(d => String(d.nip).trim() === String(user.nip).trim());

  const processedHistory = React.useMemo(() => {
    const groups = {};
    myData.forEach(d => {
      const k = getLocalDateStr(d.waktu);
      if (!groups[k]) groups[k] = [];
      groups[k].push(d);
    });

    if (!groups['2026-04-10']) {
      groups['2026-04-10'] = []; 
    }

    return Object.keys(groups).map(k => {
      const res = getUnifiedStatus(groups[k], k, user.nip);
      const isAutoNote = res.note && (res.note.toLowerCase().includes("admin") || res.note.toLowerCase().includes("otomatis") || res.note.toLowerCase().includes("sistem"));
      
      return {
        tanggal: k,
        statusTampil: res.status,
        classColor: res.badge,
        jamMasuk: res.in || '--:--',
        jamPulang: res.out || '--:--',
        keterangan: isAutoNote ? "" : res.note,
        alamatIn: res.alamatIn,
        alamatOut: res.alamatOut,
        latIn: res.latIn,
        lngIn: res.lngIn,
        latOut: res.latOut,
        lngOut: res.lngOut
      };
    }).sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));
  }, [myData, user.nip]);

  return (
    <div className="bg-white p-4 md:p-6 rounded-3xl shadow-sm border text-gray-700">
      <h3 className="font-black mb-6 flex items-center gap-2"><span className="w-2 h-6 bg-green-500 rounded-full"></span>Riwayat Kehadiran Pribadi</h3>
      <div className="space-y-4">
        {processedHistory.length > 0 ? (
          processedHistory.map((day, i) => (
            <div key={i} className="p-4 md:p-5 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-extrabold text-sm md:text-base text-gray-800">{new Date(day.tanggal).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  {day.keterangan && <p className="text-[10px] text-blue-600 font-bold italic mt-0.5">Ket: {day.keterangan}</p>}
                </div>
                <span className={`text-[9px] md:text-[10px] font-black px-2 md:px-3 py-1 rounded-full uppercase tracking-widest ${day.classColor}`}>{day.statusTampil}</span>
              </div>
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                <div className="bg-white p-2 md:p-3 rounded-xl border text-center flex flex-col justify-between">
                  <div><p className="text-[9px] md:text-[10px] text-gray-400 font-bold uppercase">Check In</p><p className="font-black text-sm md:text-base text-green-600">{day.jamMasuk}</p></div>
                  {/* PERBAIKAN LINK MAP MASUK */}
                  {day.alamatIn && <a href={`https://www.google.com/maps?q=${day.latIn},${day.lngIn}`} target="_blank" rel="noreferrer" className="text-[8px] text-green-600 mt-2 line-clamp-2 leading-tight italic hover:underline">📍 {day.alamatIn}</a>}
                </div>
                <div className="bg-white p-2 md:p-3 rounded-xl border text-center flex flex-col justify-between">
                  <div><p className="text-[9px] md:text-[10px] text-gray-400 font-bold uppercase">Check Out</p><p className="font-black text-sm md:text-base text-orange-500">{day.jamPulang}</p></div>
                  {/* PERBAIKAN LINK MAP PULANG */}
                  {day.alamatOut && <a href={`https://www.google.com/maps?q=${day.latOut},${day.lngOut}`} target="_blank" rel="noreferrer" className="text-[8px] text-orange-600 mt-2 line-clamp-2 leading-tight italic hover:underline">📍 {day.alamatOut}</a>}
                </div>
              </div>
            </div>
          ))
        ) : <div className="text-center py-10"><p className="text-gray-400 text-sm font-medium">Belum ada riwayat kehadiran.</p></div>}
      </div>
    </div>
  );
}

// --- 4. FUNGSI MONITORING TABLE ---
function MonitoringTable({ subordinates, attendanceData, refresh, role, supabase, selectedDate, setSelectedDate }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [koreksiStatus, setKoreksiStatus] = useState({});
  const [koreksiNote, setKoreksiNote] = useState({});

  const isApril10 = selectedDate === '2026-04-10';

  const saveKoreksi = async (nip, nama) => {
    const status = koreksiStatus[nip];
    const note = koreksiNote[nip] || `Koreksi oleh ${role}`;
    
    if (!status) return Swal.fire('Gagal', 'Pilih status terlebih dahulu', 'warning');

    try {
      Swal.fire({ title: 'Menyimpan...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });

      const [y, m, d] = selectedDate.split('-');
      const dStart = new Date(y, m - 1, d, 0, 0, 0).toISOString();
      const dEnd = new Date(y, m - 1, d, 23, 59, 59).toISOString();

      const { error: delError } = await supabase.from('Presensi').delete()
        .eq('nip', nip)
        .gte('waktu', dStart)
        .lte('waktu', dEnd);
        
      if (delError) throw delError; 

      const defaultLat = -0.419556; 
      const defaultLng = 116.989167;
      const defaultAlamat = "Dinas Pertanian Tanaman pangan dan Holtikultura, Jalan Ahmad Yani, Melayu, Kutai Kartanegara, Kalimantan Timur, Kalimantan, 75513, Indonesia";

      let payload = [];
      if (status === "Hadir") {
        const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
        
        const inMins = randomInt(390, 479);
        const inHH = Math.floor(inMins / 60);
        const inMM = inMins % 60;
        
        const outMins = randomInt(961, 1079);
        const outHH = Math.floor(outMins / 60);
        const outMM = outMins % 60;

        const timeIn = new Date(y, m - 1, d, inHH, inMM, 0).toISOString();
        const timeOut = new Date(y, m - 1, d, outHH, outMM, 0).toISOString();

        payload = [
          { nip, nama, status: "Masuk", waktu: timeIn, keterangan: note, latitude: defaultLat, longitude: defaultLng, alamat: defaultAlamat },
          { nip, nama, status: "Pulang", waktu: timeOut, keterangan: note, latitude: defaultLat, longitude: defaultLng, alamat: defaultAlamat }
        ];
      } else {
        const timeMid = new Date(y, m - 1, d, 12, 0, 0).toISOString();
        payload = [{ nip, nama, status: status, waktu: timeMid, keterangan: note }];
      }

      const { error: insError } = await supabase.from('Presensi').insert(payload);
      if (insError) throw insError; 

      Swal.fire('Berhasil', `Data ${nama} diperbarui`, 'success');
      setKoreksiStatus({...koreksiStatus, [nip]: ""});
      setKoreksiNote({...koreksiNote, [nip]: ""});
      if (refresh) refresh();
      
    } catch (err) { 
      console.error("Supabase Error detail:", err);
      Swal.fire('Database Menolak!', err.message || err.details || err.hint || 'Terjadi kesalahan tidak dikenal.', 'error'); 
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border overflow-hidden mt-6 md:mt-8 text-gray-700">
      <div className="p-4 md:p-6 bg-gray-50 border-b flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h3 className="font-black text-gray-700 uppercase">Monitoring & Rekap</h3>
        <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
          <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="w-full md:w-auto p-2 md:p-3 border rounded-xl text-sm font-bold shadow-sm outline-none focus:ring-2 focus:ring-green-500" />
          <input type="text" placeholder="Cari nama..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full md:w-auto p-2 md:p-3 border rounded-xl text-sm outline-none shadow-sm focus:ring-2 focus:ring-green-500" />
        </div>
      </div>
      
      <div className="overflow-x-auto pb-4">
        <table className="w-full text-left whitespace-nowrap md:whitespace-normal">
          <thead className="bg-gray-50 text-[10px] uppercase text-gray-400 font-bold border-b">
            <tr>
              <th className="p-3 md:p-4 min-w-[150px]">Pegawai</th>
              <th className="p-3 md:p-4 min-w-[120px]">Unit Kerja</th>
              <th className="p-3 md:p-4 min-w-[120px]">Status & Waktu</th>
              {!isApril10 && <th className="p-3 md:p-4 min-w-[180px]">Lokasi</th>}
              {!isApril10 && <th className="p-3 md:p-4 text-center min-w-[320px]" colSpan="3">Koreksi Admin</th>}
            </tr>
          </thead>
          <tbody className="divide-y text-xs md:text-sm">
            {subordinates.filter(sub => sub.name.toLowerCase().includes(searchTerm.toLowerCase())).map(sub => {
              
              const dailyRecords = attendanceData.filter(d => {
                if (String(d.nip).trim() !== String(sub.nip).trim()) return false;
                const dateObj = new Date(d.waktu);
                const yyyy = dateObj.getFullYear();
                const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
                const dd = String(dateObj.getDate()).padStart(2, '0');
                return `${yyyy}-${mm}-${dd}` === selectedDate;
              });
              
              const res = getUnifiedStatus(dailyRecords, selectedDate, sub.nip);
              const isAutoNote = res.note && (res.note.toLowerCase().includes("admin") || res.note.toLowerCase().includes("sistem") || res.note.toLowerCase().includes("otomatis"));
              const tampilkanKeterangan = isAutoNote ? "" : res.note;

              return (
                <tr key={sub.id} className="hover:bg-green-50/30 transition-colors align-top">
                  <td className="p-3 md:p-4 whitespace-normal">
                    <p className="font-bold mb-1">{sub.name}</p>
                    <p className="text-[9px] md:text-[10px] text-gray-400 uppercase">{sub.role}</p>
                  </td>
                  <td className="p-3 md:p-4 whitespace-normal">
                    <p className="text-[11px] md:text-xs font-bold text-gray-600">{sub.dept || 'Dinas Pertanian'}</p>
                  </td>
                  <td className="p-3 md:p-4">
                    <span className={`px-2 py-1 rounded-lg text-[9px] md:text-[10px] font-black uppercase ${res.badge}`}>{res.status}</span>
                    <div className="text-[10px] text-gray-400 mt-2 font-bold">{res.in || '--:--'} - {res.out || '--:--'}</div>
                    {tampilkanKeterangan && <div className="text-[9px] text-blue-500 mt-1 font-bold whitespace-normal">Ket: {tampilkanKeterangan}</div>}
                  </td>
                  
                  {!isApril10 && (
                    <>
                      <td className="p-3 md:p-4 whitespace-normal">
                        <div className="flex flex-col gap-3">
                          {res.latIn && (
                            <div>
                              {/* PERBAIKAN LINK MAP MASUK DI TABEL */}
                              <a href={`https://www.google.com/maps?q=${res.latIn},${res.lngIn}`} target="_blank" rel="noreferrer" className="text-[9px] bg-green-50 text-green-700 border border-green-200 px-2 py-1 rounded-md font-bold hover:bg-green-100 inline-block mb-1">
                                📍 Map Masuk
                              </a>
                              {res.alamatIn && <p className="text-[9px] text-gray-500 leading-tight italic">{res.alamatIn}</p>}
                            </div>
                          )}
                          {res.latOut && (
                            <div>
                              {/* PERBAIKAN LINK MAP PULANG DI TABEL */}
                              <a href={`https://www.google.com/maps?q=${res.latOut},${res.lngOut}`} target="_blank" rel="noreferrer" className="text-[9px] bg-orange-50 text-orange-700 border border-orange-200 px-2 py-1 rounded-md font-bold hover:bg-orange-100 inline-block mb-1">
                                📍 Map Pulang
                              </a>
                              {res.alamatOut && <p className="text-[9px] text-gray-500 leading-tight italic">{res.alamatOut}</p>}
                            </div>
                          )}
                          {!res.latIn && !res.latOut && <span className="text-[10px] text-gray-300 italic font-medium">Lokasi belum direkam</span>}
                        </div>
                      </td>

                      <td className="p-2 md:p-3 min-w-[120px]">
                        <select className="w-full p-2 border rounded-xl text-[10px] md:text-[11px] font-bold outline-none bg-white shadow-sm" value={koreksiStatus[sub.nip] || ""} onChange={(e) => setKoreksiStatus({...koreksiStatus, [sub.nip]: e.target.value})}>
                          <option value="" disabled>Status</option>
                          <option value="Hadir">Hadir</option>
                          <option value="Cuti">Cuti</option>
                          <option value="Sakit">Sakit</option>
                          <option value="Izin">Izin</option>
                          <option value="Dinas Luar">Dinas Luar</option>
                          <option value="Tanpa Keterangan">Tanpa Keterangan</option>
                        </select>
                      </td>
                      <td className="p-2 md:p-3 min-w-[180px]">
                        <input type="text" placeholder="Ketik keterangan..." className="w-full p-2 border rounded-xl text-[10px] md:text-[11px] outline-none shadow-sm" value={koreksiNote[sub.nip] || ""} onChange={(e) => setKoreksiNote({...koreksiNote, [sub.nip]: e.target.value})} />
                      </td>
                      <td className="p-2 md:p-3 min-w-[80px]">
                        <button onClick={() => saveKoreksi(sub.nip, sub.name)} className="bg-green-600 text-white w-full py-2 rounded-xl text-[10px] md:text-[11px] font-bold active:scale-95 transition-transform shadow-sm">SIMPAN</button>
                      </td>
                    </>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}