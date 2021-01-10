import React from "react";
import ReactExport from "react-export-excel";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;




const DescargaExcelProcesos = ({ boton, columnas, data }) => {
        console.log(columnas, data);
        return (
            <ExcelFile element={boton}>
                <ExcelSheet data={data} name="Procesos">
                    <ExcelColumn label="Nombre" value="name"/>
                    <ExcelColumn label="Creado" value="created_at"/>
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

export { DescargaExcelProcesos, DescargaExcelCandidatos, DescargaExcelHistorico};