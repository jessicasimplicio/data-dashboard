/*
* Funcionalidad de tu producto
*/

var techMaxPoints = 1800;
var hseMaxPoints = 1200;

//Funcionalidade do menu hamburguer
var openSideNav = document.getElementById("openNav");
openSideNav.addEventListener("click", openNav);
function openNav() {
  document.getElementById("sideNav").style.width = "250px";
}
var closeSideNav = document.getElementById("closeNav");
closeSideNav.addEventListener("click", closeNav);
function closeNav() {
  document.getElementById("sideNav").style.width = "0";
}

// Load the Visualization API and the corechart package.
google.charts.load('current', {'packages':['corechart']});
//google.charts.setOnLoadCallback(drawChart);
//drawChart(activeStudents, quittingStudents);


//Menu dinamico de sedes e geracoes
var dropHeadMenu = document.getElementById("select-heads");
dropHeadMenu.addEventListener("change", loadGenerationMenu);

var dropGenerationMenu = document.getElementById("select-generation");
dropGenerationMenu.addEventListener ("change", loadData);

window.onload = loadHeadMenu();
//window.onload = loadGenerationMenu();

function loadHeadMenu() {
  var option = document.createElement("option");
  option.innerHTML = "Selecione a sede";
  option.value = "none";
  dropHeadMenu.appendChild(option);
  for(head in data){
    var optionItem = document.createElement("option");
    optionItem.innerHTML = head;
    optionItem.value = head;
    dropHeadMenu.appendChild(optionItem);
  }
}

function loadGenerationMenu() {
  var headSelected = dropHeadMenu.value;
  dropGenerationMenu.innerHTML = "";

  var generation = document.createElement("option");
  generation.innerHTML = "Selecione a geração";
  generation.value = "none";
  dropGenerationMenu.appendChild(generation);

  for(generation in data[headSelected]){
    var genItem = document.createElement("option");
    genItem.innerHTML = generation;
    genItem.value = generation;
    dropGenerationMenu.appendChild(genItem);
  }
}

function loadData() {
	//loadTechSkillsMenu();
	//loadHseSkillsMenu();
  enrollmentStudents();
  achievements();
  netPromoScore();
  mentorRating();
}

function drawChart(activeStudents, quittingStudents) {
	// var chart = new google.visualization.DataTable(document.getElementById("drawChart"));
	var data = google.visualization.arrayToDataTable([
		['Status','Total'],
		['Ativas', activeStudents],
		['Inativas', quittingStudents]
	]);

	var options = {
          title: 'Grafico 1'
        };
       var chart = new google.visualization.PieChart(document.getElementById('drawChart'));

        chart.draw(data, options);
}

function enrollmentStudents() {
  var headSelected = dropHeadMenu.value;
  var generationSelected = dropGenerationMenu.value;

  var allStudents = data[headSelected][generationSelected]["students"].length;
  document.getElementById("all-students").innerHTML = 'Total de alunas matriculadas na sede: ' + allStudents;

  var quittingStudents = 0;
  for (i in data[headSelected][generationSelected]["students"]){
    if (data[headSelected][generationSelected]["students"][i]["active"] == false) {
      quittingStudents += 1;
    }
  }
  var rateQuitStudent = (quittingStudents/allStudents)*100;
  document.getElementById("quitting-students").innerHTML = "Alunas desistentes: " + rateQuitStudent.toFixed(2) + "%";
  var activeStudents = allStudents - quittingStudents;


	drawChart(activeStudents, quittingStudents);

  //grafico para alunas ativas e alunas desistentes



}

google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawChart);

function achievements() {
  var head = dropHeadMenu.value;
  var generation = dropGenerationMenu.value;
  var allStudents = data[head][generation]["students"].length;
	var quantitySprints = data[head][generation]["ratings"].length;
	var techAveragePoints = 0.7*techMaxPoints;
	var hseAveragePoints = 0.7*hseMaxPoints;
	var sumTechPoints = 0;
	var sumHsePoints = 0;
	var averageTechStud = 0;
	var averageHseStud = 0;

	for(var j = 0; j < quantitySprints; j++){
		sumTechPoints = 0;
		sumHsePoints = 0;

		for( i in data[head][generation]["students"] ){
			//acessa o array de sprints de cada aluna
			if (data[head][generation]['students'][i]["sprints"] != undefined){
				if (data[head][generation]["students"][i]["sprints"].length != 0){
					if( data[head][generation]["students"][i]["sprints"][j]["score"]["tech"] >= techAveragePoints){
						sumTechPoints += 1;
					}
					if(data[head][generation]["students"][i]["sprints"][j]["score"]["hse"] >= hseAveragePoints){
						sumHsePoints += 1;
					}
				}
			}
		}
		averageTechStud += sumTechPoints;
		averageHseStud += sumHsePoints;
		document.getElementById("tech-skill-sp" + (j + 1)).innerHTML = "Sprint " + (j + 1) + ": " + sumTechPoints + " " + ((sumTechPoints/allStudents)*100).toFixed(2) + "%";
		document.getElementById("hse-skill-sp" + (j + 1)).innerHTML = "Sprint " + (j + 1) + ": " + sumHsePoints+ " " + ((sumHsePoints/allStudents)*100).toFixed(2) + "%";
	}
	document.getElementById("average-tech-stud").innerHTML = "Média Tech" + (averageTechStud/4);
	document.getElementById("average-hse-stud").innerHTML = "Média HSE" + (averageHseStud/4);
}

function netPromoScore(){
	var head = dropHeadMenu.value;
  var generation = dropGenerationMenu.value;
	var ratingsLength = data[head][generation]['ratings'].length;
	var sumNPS = 0;
	for(var i = 0; i < ratingsLength; i++){
		var promoters = data[head][generation]['ratings'][i]['nps']['promoters'];
		var detractors = data[head][generation]['ratings'][i]['nps']['detractors'];
<<<<<<< HEAD
		var nps = promoters - detractors;
		sumNPS += nps;

		document.getElementById("nps-sp" + (i + 1)).innerHTML = "NPS: " + nps; 
=======
		//console.log(promoters)

>>>>>>> 3c5319968e99f4f2498bc0c4b32de6600bd9035d
	}
	var averageNPS = (sumNPS / ratingsLength);
	document.getElementById("average-nps").innerHTML = "média NPS: " + averageNPS; 
}

function mentorRating(){
  var headOffice = dropHeadMenu.value;
  var gen = dropGenerationMenu.value;
  var sum = 0;
  for( i in data[headOffice][gen]['ratings']){
    var mentorScore = parseFloat(data[headOffice][gen]['ratings'][i]["teacher"]);
    sum = sum + mentorScore;
    document.getElementById("score-mentor-sp" + (parseInt(i)+1)).innerHTML = "Sprint " + (parseInt(i)+1) + ": " + mentorScore;
  }
  average = sum / (parseInt(i) + 1);
  averagePoints = average * 100;
  var scoreAverage = document.getElementById("score-average").innerHTML = "A pontuação média é: " + averagePoints;
}

function loadDevs(){
  var dropHead = dropHeadMenu.value;
  var dropGeneration = dropGenerationMenu.value;
  var devsList = document.getElementById("developers");
  devList.innerHTML = "";
  for(generation in data[head]){
    for(i in data[head][generation]['students']){
      var people = document.createElement('div');
      people.classList.add('people');
      var img = document.createElement('img');
      img.classList.add('photo');
      img.src = data[head][generation]['students'][i]['photo'];
      devList.appendChild(people);
      people.appendChild(img);
    }
  }

}


