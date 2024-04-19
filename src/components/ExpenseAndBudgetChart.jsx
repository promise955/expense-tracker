import React, { useEffect, useState, useTransition } from "react";
import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  LineController,
  BarController,
} from "chart.js";
import { Chart } from "react-chartjs-2";

const ExpenseAndBudgetChart = () => {
  ChartJS.register(
    LinearScale,
    CategoryScale,
    BarElement,
    PointElement,
    LineElement,
    Legend,
    Tooltip,
    LineController,
    BarController
  );

 

  const [report, setReport] = useState([]);
  const [isPending,setTransition] =  useTransition()
 const   [labels,setLabel] = useState([])

  
  const  getReport = async () => {
    try {
      const response = await DataService.getDataNoAuth(`/dasboard/api/?getReport=${true}`);

       setLabel(response.date)
      setReport(response.expense);
      
    } catch (error) {
      console.log(error);
      toast.error(error);
    }
  };

   useEffect(()=> {
      setTransition(async () => await getReport())

  },[])



  const data = {
    labels,
    datasets: [
      {
        type: "bar",
        label: "Expense",
        backgroundColor: "rgb(75, 192, 192)",
        data: report,
        borderColor: "white",
        borderWidth: 2,
      },
      {
        type: "bar",
        label: "Budget",
        backgroundColor: "rgb(53, 162, 235)",
        data: report,
      },
    ],
  };
  return (
    <header className="flex">
  
      <div className="relative w-full h-80 mb-4">
        <Chart type="bar" data={data} />
    
      </div>
    
    </header>
  );
};

export default ExpenseAndBudgetChart;
