const getApi = async (path = "") => {
  try {
    const endPoint = `https://mindicador.cl/api/${path}`;
    let monedas = await fetch(endPoint);
    if (!monedas.ok) throw "Ha fallado la solicitud";
    monedas = await monedas.json();
    return monedas;
  } catch (error) {
    errorSpan.innerHTML = "ERROR: " + error;
  }
};

const convert = async (amount, code, plural = "") => {
  errorSpan.innerHTML = "";
  const monedas = await getApi();
  let result = document.querySelector("#result");
  const convertedAmount = amount / monedas[code].valor;
  result.innerHTML = convertedAmount.toFixed(3) + ` ${code}${plural}`;
  monedasChart = await getApi(code);
  const config = chartConfig(monedasChart);
  if (myChart) {
    myChart.destroy();
  }
  myChart = new Chart(canvasChart, config);
};

const chartConfig = (monedasChart) => {
  dateValues = monedasChart.serie.slice([0], [10]).reverse();
  dates = dateValues.map((dateValues) => dateValues.fecha.substring(0, 10));
  values = dateValues.map((dateValues) => dateValues.valor);
  const typeChart = "line";
  const title = `Valor de ${monedasChart.codigo} en las ultimas 10 actualizaciones`;
  const colorLine = "red";
  const config = {
    type: typeChart,
    data: {
      labels: dates,
      datasets: [
        {
          label: title,
          backgroundColor: colorLine,
          data: values,
        },
      ],
    },
  };
  return config;
};

const convertButton = document.querySelector("#convertButton");
const canvasChart = document.querySelector("#canvasChart");
const errorSpan = document.querySelector("#errorSpan");
let myChart;

convertButton.addEventListener("click", () => {
  try {
    const clpAmount = document.querySelector("#clpAmount").value;
    if (clpAmount === "") throw "No se ha agregado ningún monto a convertir.";
    else if (clpAmount <= 0 || isNaN(clpAmount))
      throw  "Se ha ingresado uno de los siguientes valores: -Números negativos / -'0' / -letras y/o símbolos";
    const moneyChange = document.querySelector("#moneyChange").value;
    const moneyPlural = document.querySelector(
      `#plural${moneyChange}`
    ).className;
    if (moneyPlural === "") {
      convert(clpAmount, moneyChange);
    } else {
      convert(clpAmount, moneyChange, moneyPlural);
    }
  } catch (error) {
    result.innerHTML = "";
    errorSpan.innerHTML = "ERROR: " + error;
    if (myChart) {
      myChart.destroy();
    }
  }
});
