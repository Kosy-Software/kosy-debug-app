(()=>{var e={584:function(e,a,n){var o,t;void 0===(t="function"==typeof(o=function(){var e=!1;function a(e){this.opts=function(){for(var e=1;e<arguments.length;e++)for(var a in arguments[e])arguments[e].hasOwnProperty(a)&&(arguments[0][a]=arguments[e][a]);return arguments[0]}({},{onClose:null,onOpen:null,beforeOpen:null,beforeClose:null,stickyFooter:!1,footer:!1,cssClass:[],closeLabel:"Close",closeMethods:["overlay","button","escape"]},e),this.init()}function n(){this.modalBoxFooter&&(this.modalBoxFooter.style.width=this.modalBox.clientWidth+"px",this.modalBoxFooter.style.left=this.modalBox.offsetLeft+"px")}return a.prototype.init=function(){if(!this.modal)return function(){this.modal=document.createElement("div"),this.modal.classList.add("tingle-modal"),0!==this.opts.closeMethods.length&&-1!==this.opts.closeMethods.indexOf("overlay")||this.modal.classList.add("tingle-modal--noOverlayClose"),this.modal.style.display="none",this.opts.cssClass.forEach((function(e){"string"==typeof e&&this.modal.classList.add(e)}),this),-1!==this.opts.closeMethods.indexOf("button")&&(this.modalCloseBtn=document.createElement("button"),this.modalCloseBtn.type="button",this.modalCloseBtn.classList.add("tingle-modal__close"),this.modalCloseBtnIcon=document.createElement("span"),this.modalCloseBtnIcon.classList.add("tingle-modal__closeIcon"),this.modalCloseBtnIcon.innerHTML='<svg viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg"><path d="M.3 9.7c.2.2.4.3.7.3.3 0 .5-.1.7-.3L5 6.4l3.3 3.3c.2.2.5.3.7.3.2 0 .5-.1.7-.3.4-.4.4-1 0-1.4L6.4 5l3.3-3.3c.4-.4.4-1 0-1.4-.4-.4-1-.4-1.4 0L5 3.6 1.7.3C1.3-.1.7-.1.3.3c-.4.4-.4 1 0 1.4L3.6 5 .3 8.3c-.4.4-.4 1 0 1.4z" fill="#000" fill-rule="nonzero"/></svg>',this.modalCloseBtnLabel=document.createElement("span"),this.modalCloseBtnLabel.classList.add("tingle-modal__closeLabel"),this.modalCloseBtnLabel.innerHTML=this.opts.closeLabel,this.modalCloseBtn.appendChild(this.modalCloseBtnIcon),this.modalCloseBtn.appendChild(this.modalCloseBtnLabel)),this.modalBox=document.createElement("div"),this.modalBox.classList.add("tingle-modal-box"),this.modalBoxContent=document.createElement("div"),this.modalBoxContent.classList.add("tingle-modal-box__content"),this.modalBox.appendChild(this.modalBoxContent),-1!==this.opts.closeMethods.indexOf("button")&&this.modal.appendChild(this.modalCloseBtn),this.modal.appendChild(this.modalBox)}.call(this),function(){this._events={clickCloseBtn:this.close.bind(this),clickOverlay:function(e){var a=this.modal.offsetWidth-this.modal.clientWidth,n=e.clientX>=this.modal.offsetWidth-15,o=this.modal.scrollHeight!==this.modal.offsetHeight;"MacIntel"===navigator.platform&&0==a&&n&&o||-1!==this.opts.closeMethods.indexOf("overlay")&&!function(e,a){for(;(e=e.parentElement)&&!e.classList.contains("tingle-modal"););return e}(e.target)&&e.clientX<this.modal.clientWidth&&this.close()}.bind(this),resize:this.checkOverflow.bind(this),keyboardNav:function(e){-1!==this.opts.closeMethods.indexOf("escape")&&27===e.which&&this.isOpen()&&this.close()}.bind(this)},-1!==this.opts.closeMethods.indexOf("button")&&this.modalCloseBtn.addEventListener("click",this._events.clickCloseBtn),this.modal.addEventListener("mousedown",this._events.clickOverlay),window.addEventListener("resize",this._events.resize),document.addEventListener("keydown",this._events.keyboardNav)}.call(this),document.body.appendChild(this.modal,document.body.firstChild),this.opts.footer&&this.addFooter(),this},a.prototype._busy=function(a){e=a},a.prototype._isBusy=function(){return e},a.prototype.destroy=function(){null!==this.modal&&(this.isOpen()&&this.close(!0),function(){-1!==this.opts.closeMethods.indexOf("button")&&this.modalCloseBtn.removeEventListener("click",this._events.clickCloseBtn),this.modal.removeEventListener("mousedown",this._events.clickOverlay),window.removeEventListener("resize",this._events.resize),document.removeEventListener("keydown",this._events.keyboardNav)}.call(this),this.modal.parentNode.removeChild(this.modal),this.modal=null)},a.prototype.isOpen=function(){return!!this.modal.classList.contains("tingle-modal--visible")},a.prototype.open=function(){if(!this._isBusy()){this._busy(!0);var e=this;return"function"==typeof e.opts.beforeOpen&&e.opts.beforeOpen(),this.modal.style.removeProperty?this.modal.style.removeProperty("display"):this.modal.style.removeAttribute("display"),document.getSelection().removeAllRanges(),this._scrollPosition=window.pageYOffset,document.body.classList.add("tingle-enabled"),document.body.style.top=-this._scrollPosition+"px",this.setStickyFooter(this.opts.stickyFooter),this.modal.classList.add("tingle-modal--visible"),"function"==typeof e.opts.onOpen&&e.opts.onOpen.call(e),e._busy(!1),this.checkOverflow(),this}},a.prototype.close=function(e){if(!this._isBusy()){if(this._busy(!0),"function"==typeof this.opts.beforeClose&&!this.opts.beforeClose.call(this))return void this._busy(!1);document.body.classList.remove("tingle-enabled"),document.body.style.top=null,window.scrollTo({top:this._scrollPosition,behavior:"instant"}),this.modal.classList.remove("tingle-modal--visible");var a=this;a.modal.style.display="none","function"==typeof a.opts.onClose&&a.opts.onClose.call(this),a._busy(!1)}},a.prototype.setContent=function(e){return"string"==typeof e?this.modalBoxContent.innerHTML=e:(this.modalBoxContent.innerHTML="",this.modalBoxContent.appendChild(e)),this.isOpen()&&this.checkOverflow(),this},a.prototype.getContent=function(){return this.modalBoxContent},a.prototype.addFooter=function(){return function(){this.modalBoxFooter=document.createElement("div"),this.modalBoxFooter.classList.add("tingle-modal-box__footer"),this.modalBox.appendChild(this.modalBoxFooter)}.call(this),this},a.prototype.setFooterContent=function(e){return this.modalBoxFooter.innerHTML=e,this},a.prototype.getFooterContent=function(){return this.modalBoxFooter},a.prototype.setStickyFooter=function(e){return this.isOverflow()||(e=!1),e?this.modalBox.contains(this.modalBoxFooter)&&(this.modalBox.removeChild(this.modalBoxFooter),this.modal.appendChild(this.modalBoxFooter),this.modalBoxFooter.classList.add("tingle-modal-box__footer--sticky"),n.call(this),this.modalBoxContent.style["padding-bottom"]=this.modalBoxFooter.clientHeight+20+"px"):this.modalBoxFooter&&(this.modalBox.contains(this.modalBoxFooter)||(this.modal.removeChild(this.modalBoxFooter),this.modalBox.appendChild(this.modalBoxFooter),this.modalBoxFooter.style.width="auto",this.modalBoxFooter.style.left="",this.modalBoxContent.style["padding-bottom"]="",this.modalBoxFooter.classList.remove("tingle-modal-box__footer--sticky"))),this},a.prototype.addFooterBtn=function(e,a,n){var o=document.createElement("button");return o.innerHTML=e,o.addEventListener("click",n),"string"==typeof a&&a.length&&a.split(" ").forEach((function(e){o.classList.add(e)})),this.modalBoxFooter.appendChild(o),o},a.prototype.resize=function(){console.warn("Resize is deprecated and will be removed in version 1.0")},a.prototype.isOverflow=function(){return window.innerHeight<=this.modalBox.clientHeight},a.prototype.checkOverflow=function(){this.modal.classList.contains("tingle-modal--visible")&&(this.isOverflow()?this.modal.classList.add("tingle-modal--overflow"):this.modal.classList.remove("tingle-modal--overflow"),!this.isOverflow()&&this.opts.stickyFooter?this.setStickyFooter(!1):this.isOverflow()&&this.opts.stickyFooter&&(n.call(this),this.setStickyFooter(!0)))},{modal:a}})?o.call(a,n,a,e):o)||(e.exports=t)}},a={};function n(o){var t=a[o];if(void 0!==t)return t.exports;var i=a[o]={exports:{}};return e[o].call(i.exports,i,i.exports,n),i.exports}(()=>{"use strict";const e=["Rudy","Adolfo","Alfred","Augustus","Kymani","Gabriella","Justice","Payton","Mollie","Bruno","Kaitlyn","Kenneth","Monserrat","Terrence","Travis","Ainsley","Lyric","Aracely","Bennett","Cedric","Leanna","Mariana","Raiden","Remington","Luis","Mary","Jaidyn","Diego","Dayana","Diamond","Matthew","Alannah","Noelle","Haven","Dean","Maren","Areli","Terrell","Natalya","Nigel","Eleanor","Perla","Jalen","Cullen","Cristian","Brice","Daniel","Tatiana","Noel","Coby","Rodrigo","Keshawn","Gwendolyn","Makena","Osvaldo","Elliana","Esteban","Kaylen","Karma","Hazel","Reagan","Hayden","Sergio","Kathy","Natasha","Trystan","Lilah","Matthias","Taniyah","Mohammad","Isla","Devan","Jared","Savanah","Yareli","Lillian","Trevin","Maya","Makhi","Braelyn","Anabella","Devon","Selena","Anaya","Yadira","Abagail","Mallory","Miriam","Carlee","Amare","Tatum","George","Tristin","Jordyn","Melissa","Alivia","Garrett","Harper","Josue","Diya","Gael","Tyrone","Sidney","Alena","Eugene","Maximus","Gerald","Dania","Jair","Skyler","Jasper","Ashleigh","Natalie","Jerry","Lucia","Alyson","Jacob","Sonia","Abram","Kira","Kade","Jessica","Ian","Abbey","Reed","Kyan","Tyshawn","Malachi","Belen","Pranav","Elaina","Monique","Joseph","Tia","Paloma","Madilynn","Ariel","Jack","Meredith","Kolby","Carolyn","Cannon","Abdiel","Ayanna","Felix","Charlize","Celia","Jeremiah","Spencer","Zariah","Jan","Caden","Lailah","Adriana","Karley","Markus","Riley","Zaniyah","Danielle","Sanai","Paris","Izayah","Jillian","Cassandra","James","Reilly","Jayda","Libby","Kaleb","Deshawn","Brandon","Joselyn","Gavyn","Johnathon","Chaim","Keagan","Brennen","Kianna","Johanna","Patrick","Marco","Derek","Cali","Abigayle","Madeline","Adyson","Wesley","Anderson","Chad","Jadyn","Jazmyn","Dashawn","Livia","Camille","Kamora","Alexia","Kinley","Felicity","Yasmine","Bianca","Ace","Rebecca","Mackenzie","Veronica","Alex","Asia","Jaylin","Desirae","Brent","Ashton","Ingrid","Carly","Hayley","Madden","Jaron","Valentina","Zara","Brycen","Gavin","Yazmin","Jakayla","Theresa","Zayden","Jazmin","Leia","Zoey","Gillian","Wilson","Clarissa","Case","Ryland","Kamari","Lorelei","Camden","Bradyn","Savanna","Alexandria","Guillermo","Ayana","Rihanna","Marvin","Serenity","Alana","Landyn","Ethen","Evelyn","Quinn","Zavier","Edwin","Emily","Jon","Stanley","Jamir","Carlo","Mitchell","Anika","Mikaela","Aaliyah","Jaslene","Jaydan","Aisha","Brielle","Trace","Sabrina","Sage","Shayla","Jagger","Claire","Andres","Layton","Charlie","Ethan","Danika","Madilyn","Cadence","Kailey","Elena","Bentley","Gia","Todd","Brayan","Aryan","Arnav","Aubrie","Roselyn","Dana","Conner","Kylee","Kaitlin","Henry","Ashly","Andy","Cash","Curtis","Hanna","Issac","Jazlyn","Jason","Isabel","Julius","Allisson","Eden","Destinee","Landen","Raul","Robert","Cassius","Dante","Londyn","Nico","Chance","Shiloh","Gideon","Rose","Konner","Leonardo","Cynthia","Brett","Raelynn","Francesca","Tabitha","Joey","Gunnar","Ty","Bryson","Jerimiah","Colten","Rohan","Kameron","Jazlene","Autumn","Alessandra","Marisol","Laila","Briana","Albert","Caylee","Mckenna","Kamryn","Kaila","Ryan","Desiree","Rex","Whitney","Nadia","Rubi","Miles","Crystal","Nickolas","Moshe","Jewel","Leyla","Davin","Alfonso","Kylan","Maribel","Jacquelyn","Wayne","Jett","Sylvia","Aaron","Kian","Ernest","Christina","Anna","Dax","Angelo","Adam","Ellis","Julia","Kassidy","Hunter","Rosa","Byron","Abel","Kendall","Ashtyn","Marcus","Maverick","Dylan","Brynn","Janae","Marie","Aleah","Erica","Kristina","Fatima","Dorian","Makenzie","Samantha","Bailey","Demarcus","Alan","Barbara","Madalynn","Taryn","Marquise","Oswaldo","Saige","Kimberly","Luka","Monica","Jorge","Octavio","Caleb","Lara","Hassan","Joe","Lilyana","Tamara","Julissa","Kassandra","Quincy","Hillary","Kendrick","Carter","Brennan","Dario","Eileen","Justine","Taylor","Johnathan","Ricky","Alonzo","Drake","Amani","Cierra","Tommy","Ishaan","Kelly","Beckett","Amelia","Ryleigh","Jean","Jackson","Siena","Jaquan","Mike","Angelica","Jaliyah","Sheldon","Mathew","Slade","Saniya","Gilbert","Michaela","Sarah","Clara","Tania","Kyle","Zoe","Sarai","Killian","Isabell","Destiny","Adelaide","Tobias","Ronan","Adrien","Jenny","Amina","Jenna","Lauryn","Cheyanne","Janiya","Rigoberto","Renee","Elaine","Jimmy","Lawrence","Stella","Warren","Tristian","Camila","Gisselle","Hugo","Nathan","Fernanda","Tony","Hannah","Phoenix","Anahi","Sonny","Clayton","Kamden","Maia","Aydan","Yael","Jaylynn","Baylee","Elliott","Alyvia","Kyson","Alaina","Nina","Madisyn","Pedro","Patricia","Kenna","Collin","Mylee","Gregory","Jazlynn","Hailee","Zachary","Aria","Lorenzo","Dominique","Ciara","Vivian","Dillan","Joy","Ezra","Misael","Desmond","Haylee","Immanuel","Jorden","Jaden","Colt","Asher","Jerome","Alexis","Beau","Reuben","Richard","Adriel","Jamie","Gretchen","Shane","Jonathan","Alicia","Aydin","Malik","Geovanni","Jaydin","Ramiro","Jayce","Quintin","Ismael","Eva","German","Ariana","Nataly","Santino","Emilia","Kristin","Van","Salvatore","Beatrice","Jaelyn","Tianna","Sammy","Kristopher","Trenton","Xiomara","Janet","Jesse","Matilda","Averie","Irvin","Emilee","Penelope","Stephen","Karter","Melvin","Jamari","Anya","Demetrius","Rey","Louis","Cailyn","Corbin","Chloe","Kareem","Kaylie","Samara","Giovanna","Nathen","Miya","Jovanni","Makayla","Noemi","Karlee","Jayden","Jaiden","Izabella","Krish","Bridger","Rachel","Trey","Yahir","Kolton","Rayna","Roderick","Elijah","August","Ibrahim","Hallie","Camilla","Romeo","Alvaro","Margaret","April","Emelia","Hailey","Moses","Jose","Blaze","Jeffrey","Pablo","Gracelyn","Blake","Brenden","Karsyn","Madelyn","Marin","Aron","Jude","Zander","Zane","Karen","Clinton","Kaydence","Amaya","Tori","Dayanara","Muhammad","Marcos","Alexander","Simone","Abril","Carla","Elise","Isis","Arthur","Alina","Jovanny","Troy","Bryce","Giovanni","Kaelyn","Carlos","Camryn","Lexie","Aliya","Greyson","Nathalia","Dayton","Delaney","Dawson","Hugh","Alec","Bernard","Violet","Finley","Adrianna","Walter","Jairo","Catherine","Ignacio","Keenan","Clare","Jessie","Darian","Elias","Shyanne","Dominick","Mckenzie","Kody","Willie","Macey","Ivy","Keon","Randall","Tyree","Elianna","Mauricio","Paxton","Shawn","Kaya","Jarrett","Keaton","Princess","Paityn","Dustin","Uriel","Isabelle","Kylie","Emerson","Walker","Aldo","Anabelle","Macy","Chana","Thomas","Ansley","Camron","Carley","Kasen","Leandro","Jordin","Fisher","Estrella","Abbie","Juan","Brenda","Max","Annabella","Lindsey","Melanie","Julio","Asa","Dahlia","Baron","Erik","Rylee","Tomas","Jaxon","Nora","Mara","Colton","Sam","Leland","Ronnie","Cade","Jovany","Chris","Kellen","Nash","Lia","Sloane","Zackery","Martha","Efrain","Omar","Ann","Jamarion","Sandra","Sofia","Faith","Joshua","Dulce","Jadiel","Jamal","Rodolfo","Lucille","Arely","Bryanna","Salvador","Dangelo","Gabrielle","Leroy","Jesus","Jimena","Jabari","Hailie","Liberty","Glenn","Isaac","Ashlynn","Brodie","Nathanael","Jermaine","Courtney","Gunner","Juliana","Amya","Zechariah","Bobby","Kiana","Karissa","Thaddeus","Rishi","Cora","Harrison","Alanna","Shea","Allison","Araceli","Dakota","Melina","Adalyn","Sebastian","Brooklynn","Lukas","Marley","Molly"].map((e=>({sort:Math.random(),value:e}))).sort(((e,a)=>e.sort-a.sort)).map((e=>e.value)),a=["Dickson","Mcgrath","Burch","Stuart","Pugh","Caldwell","Bowers","Krueger","Copeland","Mcfarland","Phelps","Hill","Odom","Logan","Serrano","Cabrera","Cross","Terry","Mckay","Lutz","Andrews","Skinner","Haney","Frazier","Clarke","Nolan","Blackburn","Carrillo","Cole","Walton","Paul","Ware","Drake","Pratt","Potter","Rivera","Carpenter","Ibarra","Ross","Calderon","Dennis","Santos","Sampson","Mata","Tran","Wagner","Underwood","Lloyd","Curtis","Bartlett","Cherry","Koch","Gray","Odonnell","Duncan","Parsons","Conrad","Yang","Bautista","Kidd","Stark","Cobb","Novak","Hartman","Roman","Rocha","Burton","Webb","Bryant","Blanchard","Young","Beltran","Reese","Powell","Collier","Wall","Bailey","Mccormick","Chase","Molina","Simon","Boyer","Swanson","Bradley","Horton","Rogers","Hays","Gilbert","Strickland","Newman","Roy","Parks","Randall","Galvan","Buck","Rosales","King","Zimmerman","Walls","Rubio","Barrera","Browning","Rios","Nguyen","Willis","Torres","Patrick","Reilly","Dyer","Hooper","Floyd","English","Weiss","Osborne","Vazquez","Morse","Gomez","Huang","Singh","Zamora","Fuentes","Everett","Quinn","Fritz","Haley","Kerr","Cannon","Mccoy","Chen","Anderson","Kemp","Chan","Joyce","Reyes","Harmon","Ramsey","Whitney","Olson","Montoya","Herring","Klein","Gillespie","Atkins","Miles","Petty","Russell","Hickman","Martin","Arias","Herrera","Gould","Durham","Howard","Johns","Diaz","Riggs","May","Ashley","Mosley","Hood","Wilkinson","Riddle","Evans","Wyatt","Ellison","Cruz","Poole","Turner","Bush","Duarte","Moore","Giles","Armstrong","Ryan","Farmer","Burgess","Wolf","Greene","Barnes","Gonzales","Holder","Garza","Arnold","Vaughn","Pope","Olsen","Leon","Garrison","Sherman","Mcdaniel","Petersen","Weaver","Raymond","Oneal","Obrien","Flores","Herman","Henson","Harrison","Perez","Huff","Choi","Pitts","Mueller","Mccullough","Park","Schwartz","Ochoa","Graves","Silva","Flowers","Jensen","Houston","Schultz","Webster","Cunningham","Khan","Oneill","Bishop","Pruitt","Bradford","Blevins","Reeves","Sutton","Bright","Christian","Vargas","Mahoney","Warren","Harvey","Sloan","Chaney","Gibbs","Zavala","Santiago","Duke","Lyons","Stokes","Nixon","Moody","Humphrey","Edwards","Wiley","Rhodes","Yoder","Garrett","Levy","Franco","Estes","Powers","Duffy","Hale","Carroll","Roberson","Munoz","Hatfield","Booker","Lucas","Sawyer","Mooney","Hansen","Espinoza","Gross","Palmer","Gilmore","Maldonado","Jimenez","Dougherty","Love","Kim","Hunter","Fowler","Richards","Burke","Nash","Lowery","Howe","Bonilla","Stein","Massey","Dunlap","Rowland","Rosario","Kelly","Goodman","Mann","Owens","Keller","Hahn","Hunt","Vasquez","Solomon","Porter","Suarez","Hudson","Velez","Thompson","Barber","Costa","Lin","Walsh","Mullen","Horn","Acevedo","Woodward","Alvarado","Contreras","Spears","Andrade","Wade","Mcknight","Holt","Alexander","Hester","Orozco","Lopez","Roberts","Cisneros","Davenport","Mercado","Avery","Esparza","Juarez","Carlson","Watson","Mcintyre","Cervantes","Ballard","Wong","Fitzpatrick","Acosta","Preston","Villegas","Burns","Rasmussen","Erickson","Dudley","Brady","Lawson","Finley","Brooks","Robles","Campos","Velazquez","Proctor","Higgins","Miller","Lynn","Rose","Hanson","Perry","Rivers","Franklin","Watkins","Hughes","Monroe","Moon","Werner","Jarvis","Pena","Golden","Horne","Barr","Castro","Wilkins","Patton","Chapman","Hoover","Sexton","Day","Pace","Mayo","Pittman","Davis","Meza","Villarreal","Moran","Cantu","Church","Fuller","Berger","Landry","Hinton","Summers","Cohen","Gill","Atkinson","Gentry","Snow","Nelson","Benjamin","Kent","Arellano","Tyler","Bentley","Mcdowell","Burnett","Curry","Lambert","Hebert","Shea","Collins","Manning","Huber","Solis","Maddox","Bell","Mullins","Mckenzie","Craig","Lam","Fisher","Holden","Rangel","Colon","Adkins","Bruce","Francis","Harper","Schaefer","Jacobs","Rice","Livingston","Martinez","Nielsen","Faulkner","Nicholson","Beck","Benson","Sanders","Dodson","Jackson","Benitez","Stephens","Shields","Hoffman","Bernard","Ruiz","Chung","Meyers","Richmond","Sheppard","Huynh","Hurst","Fry","Shaw","Farrell","Fernandez","Malone","Camacho","Hicks","Cowan","Kirby","Anthony","Henderson","Tapia","Williamson","Mcgee","Best","Morrison","Hamilton","Johnston","Hensley","Rollins","Mcconnell","Sellers","Navarro","Oliver","Case","Brandt","Bates","Black","Moyer","Fitzgerald","Salas","Stanley","Liu","Glover","Aguirre","Butler","Todd","Ward","Brock","Mendoza","Allison","Cooley","Smith","Delacruz","Dawson","Norton","Montes","Parker","Randolph","Grimes","Goodwin","Harrington","Waller","Wise","Fields","Carson","Mcpherson","Winters","Shah","Cochran","Kelley","Byrd","Key","Moses","Howell","Wilcox","Holloway","Yu","Small","Pacheco","Conley","Shannon","Shaffer","Stafford","Lawrence","Adams","Donaldson","Wilkerson","Beasley","Wood","Lara","Patterson","Larsen","Alvarez","Cardenas","Friedman","Cain","Conway","Grant","Weeks","Rich","Hendrix","Vaughan","Brennan","Thornton","Hull","Charles","Pollard","Vega","Macdonald","Dalton","Jefferson","Hammond","Wright","Robinson","Peterson","Stevenson","Carter","Hobbs","Santana","Lee","Mccann","Rowe","Mills","Hodges","Baxter","Saunders","Hayes","Joseph","Ray","Medina","Decker","Stanton","Foley","Callahan","Hurley","Boyle","Braun","Daniel","Good","Frost","Roach","Neal","Singleton","Leonard","Russo","Casey","Perkins","Lowe","Potts","Meyer","Hodge","Conner","Dorsey","Yates","Mcneil","Hampton","Hubbard","Dean","Jordan","Morris","Becker","Hawkins","Marquez","Branch","Bowman","Forbes","Woods","Mcguire","Ortiz","Waters","Hendricks","Downs","Snyder","Harrell","Stewart","White","Estrada","Blackwell","Reid","Hayden","Nichols","Walters","Stone","Gordon","Cline","Escobar","Scott","Mcclure","Larson","Sparks","Leach","Romero","Strong","Lozano","Davila","Valdez","Heath","Elliott","Richard","Cameron","Osborn"].map((e=>({sort:Math.random(),value:e}))).sort(((e,a)=>e.sort-a.sort)).map((e=>e.value)),o=function*(){let n=0;for(;;)n++,n>a.length&&(n=0),yield e[n]+a[n];return""}(),t={buildingKey:"TestBuilding",buildingName:"TestBuilding"},i={floorUuid:"TestFloor",floorName:"TestFloor"},l={tableUuid:"TestTable",tableName:"TestTable",numberOfSeats:999},s={roomUuid:"TestRoom",roomName:"TestRoom"},r=(e,a)=>{let n=a.reduce(((e,a)=>{switch(a.clientLocation.type){case"seated-at-table":e[a.clientLocation.seatNumber]=!0}return e}),new Array(++e.numberOfSeats));for(let a=1;a<=e.numberOfSeats;a++)if(!n[a])return a;throw"No more available unclaimed seats..."};var d,c=n(584);!function(e){(e.Debugger||(e.Debugger={})).App=class{constructor(){this.clients=[]}start(e){this.state=e,window.addEventListener("message",(e=>{this.receiveIncomingMessage(e.data,e.source)})),document.getElementById("add-client").onclick=e=>{this.state["app-url"]?this.addNewClient(this.state["app-url"]):alert("Please select an app URL first")},document.getElementById("setup").onclick=e=>{return a=this,n=void 0,t=function*(){let e=yield function(e){let a=null;return new Promise(((n,o)=>{const t=document.querySelector("#setupRoot").content.firstElementChild.cloneNode(!0),i=t.querySelector("#app-url");i.value=e["app-url"]||"";const l=()=>{const e=i.value;return e?n({"app-url":e}):o()};t.querySelector("#confirm").onclick=e=>l(),t.querySelector("#cancel").onclick=e=>o(),a=new c.modal({footer:!1,closeMethods:["overlay","escape"],closeLabel:"Close",onClose:()=>l()}),a.setContent(t),a.open()})).finally((()=>null==a?void 0:a.close()))}(this.state);this.state=e,function(e){localStorage.setItem("state",JSON.stringify(e));let a=new URLSearchParams(window.location.search);a.set("url",e["app-url"]);let n=window.location.protocol+"//"+window.location.host+window.location.pathname+"?"+a.toString();window.history.pushState?window.history.pushState({path:n},"",n):window.location.href=n}(e)},new((o=void 0)||(o=Promise))((function(e,i){function l(e){try{r(t.next(e))}catch(e){i(e)}}function s(e){try{r(t.throw(e))}catch(e){i(e)}}function r(a){var n;a.done?e(a.value):(n=a.value,n instanceof o?n:new o((function(e){e(n)}))).then(l,s)}r((t=t.apply(a,n||[])).next())}));var a,n,o,t}}receiveIncomingMessage(e,a){switch(e.type){case"ready-and-listening":this.log("Ready and listening.");let n=this.clients.filter((e=>e.iframe.contentWindow===a));if(1!==n.length)throw"Could not find the message's source, this should not occur?";{let e=n[0],a={type:"client-has-joined",payload:e.info};this.clients.forEach((e=>{this.sendKosyMessageToAppClient(a,e)})),this.sendKosyMessageToAppClient({type:"get-app-state",clientUuids:[e.info.clientUuid]},this.clients[0])}break;case"receive-app-state":this.log("Kosy received the app's current state"),this.clients.filter((e=>!e.initialized)).forEach((a=>{this.sendInitialInfoMessage(a,e.payload),a.initialized=!0}));break;case"relay-message":this.log("Relay message: ",e.payload);let o={type:"receive-message",payload:e.payload};this.clients.forEach((e=>this.sendKosyMessageToAppClient(o,e)));break;case"stop-app":this.log("Stop app"),[...this.clients].forEach((e=>this.removeClient(e.info.clientUuid)))}}addNewClient(e){let a=(n=this.clients.map((e=>e.info)),{clientUuid:Date.now().toString(),clientName:o.next().value,clientLocation:{type:"seated-at-table",building:t,floor:i,room:s,table:l,seatNumber:r(l,n)}});var n;let d={info:a,iframe:function(e,a,n){let o=document.getElementById("clientRoot").content.firstElementChild.cloneNode(!0),t=o.querySelector("iframe");return t.src=a,t.id=e.clientUuid,o.querySelector("button").onclick=a=>{n(e.clientUuid)},document.getElementById("clients").appendChild(o),t}(a,e,(e=>this.removeClient(e))),initialized:!1};this.clients.push(d)}removeClient(e){let a=this.clients.find((a=>a.info.clientUuid==e));this.clients=this.clients.filter((e=>e!=a));let n={type:"client-has-left",clientUuid:e};this.clients.forEach((e=>this.sendKosyMessageToAppClient(n,e))),a.iframe.parentElement.remove()}sendInitialInfoMessage(e,a){let n={type:"receive-initial-info",payload:{clients:this.clients.reduce(((e,a)=>(e[a.info.clientUuid]=a.info,e)),{}),currentClientUuid:e.info.clientUuid,initializerClientUuid:this.clients[0].info.clientUuid,currentAppState:a}};this.sendKosyMessageToAppClient(n,e)}sendKosyMessageToAppClient(e,a){a.iframe.contentWindow.postMessage(e,a.iframe.src)}log(...e){console.trace("Kosy received: ",...e)}},(new e.Debugger.App).start(function(){var e;let a=new URLSearchParams(window.location.search).get("url");if(a)return{"app-url":a};{let a=JSON.parse(null!==(e=localStorage.getItem("state"))&&void 0!==e?e:"{}");if(a["app-url"])return a}return{}}())}(d||(d={}))})()})();