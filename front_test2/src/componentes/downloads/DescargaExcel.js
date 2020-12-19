import React from "react";
import ReactExport from "react-export-excel";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

const dataSet1 = [
    {
        name: "Johson",
        amount: 30000,
        sex: 'M',
        is_married: true
    },
    {
        name: "Monika",
        amount: 355000,
        sex: 'F',
        is_married: false
    },
    {
        name: "John",
        amount: 250000,
        sex: 'M',
        is_married: false
    },
    {
        name: "Josef",
        amount: 450500,
        sex: 'M',
        is_married: true
    }
];


const DescargaExcelProcesos = ({ boton, columnas, data }) => {

        return (
            <ExcelFile element={boton}>
                <ExcelSheet data={data} name="Procesos">
                    <ExcelColumn label="Nombre" value="nombre"/>
                    <ExcelColumn label="Creado" value="createdAt"/>
                    <ExcelColumn label="Status" value="status"/>
                    <ExcelColumn label="Below" value="below"/>
                    <ExcelColumn label="Normal" value="normal"/>
                    <ExcelColumn label="Outstanding" value="outstanding"/>
                </ExcelSheet>
            </ExcelFile>
        );
}

const DescargaExcelCandidatos = ({ boton, columnas, data }) => {

        return (
            <ExcelFile element={boton}>
                <ExcelSheet data={data} name="Candidatos">
                    <ExcelColumn label="Nombre" value="nombre"/>
                    <ExcelColumn label="Carrera" value="profesion"/>
                    <ExcelColumn label="Universidad" value="universidad"/>
                    
                    <ExcelColumn label="Email" value="email"/>
                    <ExcelColumn label="Ciudad" value="ciudad"/>
                </ExcelSheet>
            </ExcelFile>
        );
}

const DescargaExcelHistorico = ({ boton, columnas, data }) => {

        return (
            <ExcelFile element={boton}>
                <ExcelSheet data={data} name="Historico">
                    <ExcelColumn label="Nombre" value="nombre"/>
                    <ExcelColumn label="Carrera" value="profesion"/>
                    <ExcelColumn label="Universidad" value="universidad"/>
                    
                    <ExcelColumn label="Email" value="email"/>
                    <ExcelColumn label="Ciudad" value="ciudad"/>
                </ExcelSheet>
            </ExcelFile>
        );
}

const DescargaExcelTest = (props) => {
        return (
            <ExcelFile element={<button>hola</button>}>
                <ExcelSheet data={dataSet1} name="Employees">
                    <ExcelColumn label="Name" value="name"/>
                    <ExcelColumn label="Wallet Money" value="amount"/>
                    <ExcelColumn label="Gender" value="sex"/>
                    <ExcelColumn label="Marital Status"
                                 value={(col) => col.is_married ? "Married" : "Single"}/>
                </ExcelSheet>
            </ExcelFile>
        );
}

export { DescargaExcelProcesos, DescargaExcelCandidatos, DescargaExcelHistorico};