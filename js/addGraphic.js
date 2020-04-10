const addGraphic = async (type, country) => {
    
    const confirmed = [];
    const projection = []; 
    const options = {year: 'numeric', month: 'short', day: 'numeric' };

    await $.getJSON(`https://covid-projection.herokuapp.com/${country}/${type}`, function(data) {  

        $.each(data.cases, function(key, value){
            confirmed.push({x: new Date(value[0]), y: parseInt(value[1])});
        });
        $.each(data.pred, function(key, value){
            projection.push({x: new Date(value[0]), y: parseInt(value[1])});
        });	
    });
    
    var xlabels = confirmed.map(value => {
        return ((value.x).toLocaleDateString('pt-BR', options));
    });

    var ctx = document.getElementById(`grafico-${type}`).getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: xlabels,
            datasets: [
                {
                    label: 'Casos Confirmados',
                    data: confirmed,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.5)'
                    ],

                    borderWidth: 1
                },
                {
                    label: 'Previsões',
                    data: projection,
                    backgroundColor: [
                        'rgba(54, 162, 235, 0.5)'
                    ],

                    borderWidth: 1
                },
            ]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });


    

}


const addCountrySelect = async () => {
    const country = [];
    const cboCases = document.getElementById("cboCases");
    const cboDeaths = document.getElementById("cboDeaths");


    await $.getJSON(`https://api.covid19api.com/countries`, function(data) {  
        $.each(data, function(key, value){
            country.push(value);
        });
    });
    
    
    // country.sort(compare);


    country.map(item => {
        var option = document.createElement("option");
        option.value = item.ISO2;
        option.text = item.Country;

        cboCases.appendChild(option);
    });

    country.map(item => {
        var option = document.createElement("option");
        option.value = item.ISO2;
        option.text = item.Country;
        
        cboDeaths.appendChild(option);
    });
}


$(document).ready(async function(){
    await addCountrySelect();

    const countrySelectedCases = document.getElementById("cboCases").value;
    const countrySelectedDeaths = document.getElementById("cboDeaths").value;

    addGraphic("cases", countrySelectedCases);
    addGraphic("deaths", countrySelectedDeaths);


    $("#cboCases").change(function(){
        var selectedCountry = $(this).children("option:selected").val();
        addGraphic("cases", selectedCountry);
    });
    $("#cboDeaths").change(function(){
        var selectedCountry = $(this).children("option:selected").val();
        addGraphic("deaths", selectedCountry);
    });

});

function compare(a,b) {
    if (a.Country < b.Country)
        return -1;
    if (a.Country > b.Country)
        return 1;
    return 0;
}


