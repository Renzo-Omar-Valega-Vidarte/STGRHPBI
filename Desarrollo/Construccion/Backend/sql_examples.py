sql_examples = [
    {
        "question": "¿Qué departamentos tuvieron el mayor gasto de monto ejecución?",
        "query": """
SELECT TOP 1 U.DEPARTAMENTO, SUM(F.MONTO_EJECUCION) AS TOTAL_EJECUCION
FROM Gastos.FACT_GASTOS F
JOIN Generico.DIM_UBIGEO U ON F.Ubigeo_Key = U.Ubigeo_Key
GROUP BY U.DEPARTAMENTO
ORDER BY TOTAL_EJECUCION DESC;
        """
    },
    {
        "question": "¿Qué departamentos tuvieron el menor gasto de monto ejecución?",
        "query": """
SELECT TOP 1 U.DEPARTAMENTO, SUM(F.MONTO_EJECUCION) AS TOTAL_EJECUCION
FROM Gastos.FACT_GASTOS F
JOIN Generico.DIM_UBIGEO U ON F.Ubigeo_Key = U.Ubigeo_Key
GROUP BY U.DEPARTAMENTO
ORDER BY TOTAL_EJECUCION ASC;
        """
    },
    {
        "question": "¿Qué departamentos tuvieron mayor gasto de PIA?",
        "query": """
SELECT TOP 1 U.DEPARTAMENTO, SUM(F.MONTO_PIA) AS TOTAL_PIA
FROM Gastos.FACT_GASTOS F
JOIN Generico.DIM_UBIGEO U ON F.Ubigeo_Key = U.Ubigeo_Key
GROUP BY U.DEPARTAMENTO
ORDER BY TOTAL_PIA DESC;
        """
    },
    {
        "question": "¿Qué departamentos tuvieron menor gasto de PIA?",
        "query": """
SELECT TOP 1 U.DEPARTAMENTO, SUM(F.MONTO_PIA) AS TOTAL_PIA
FROM Gastos.FACT_GASTOS F
JOIN Generico.DIM_UBIGEO U ON F.Ubigeo_Key = U.Ubigeo_Key
GROUP BY U.DEPARTAMENTO
ORDER BY TOTAL_PIA ASC;
        """
    },
    {
        "question": "¿Qué departamentos tuvieron mayor gasto de PIM?",
        "query": """
SELECT TOP 1 U.DEPARTAMENTO, SUM(F.MONTO_PIM) AS TOTAL_PIM
FROM Gastos.FACT_GASTOS F
JOIN Generico.DIM_UBIGEO U ON F.Ubigeo_Key = U.Ubigeo_Key
GROUP BY U.DEPARTAMENTO
ORDER BY TOTAL_PIM DESC;
        """
    },
    {
        "question": "¿Qué departamentos tuvieron menor gasto de PIM?",
        "query": """
SELECT TOP 1 U.DEPARTAMENTO, SUM(F.MONTO_PIM) AS TOTAL_PIM
FROM Gastos.FACT_GASTOS F
JOIN Generico.DIM_UBIGEO U ON F.Ubigeo_Key = U.Ubigeo_Key
GROUP BY U.DEPARTAMENTO
ORDER BY TOTAL_PIM ASC;
        """
    },
    {
        "question": "¿Cuál es el departamento más poblado?",
        "query": """
SELECT TOP 1 DEPARTAMENTO, SUM(POBLACION_DEPARTAMENTO) AS TOTAL_POBLACION
FROM Generico.DIM_UBIGEO
GROUP BY DEPARTAMENTO
ORDER BY TOTAL_POBLACION DESC;
        """
    },
    {
        "question": "¿En qué año se tuvo el mayor gasto de monto ejecución?",
        "query": """
SELECT TOP 1 FEC.ANIO, SUM(F.MONTO_EJECUCION) AS TOTAL_EJECUCION
FROM Gastos.FACT_GASTOS F
JOIN Generico.DIM_FECHA FEC ON F.Fecha_Key = FEC.Fecha_Key
GROUP BY FEC.ANIO
ORDER BY TOTAL_EJECUCION DESC;
        """
    },
    {
        "question": "¿En qué año se tuvo el menor gasto de monto ejecución?",
        "query": """
SELECT TOP 1 FEC.ANIO, SUM(F.MONTO_EJECUCION) AS TOTAL_EJECUCION
FROM Gastos.FACT_GASTOS F
JOIN Generico.DIM_FECHA FEC ON F.Fecha_Key = FEC.Fecha_Key
GROUP BY FEC.ANIO
ORDER BY TOTAL_EJECUCION ASC;
        """
    },
    {
        "question": "¿En qué año se tuvo el mayor gasto de PIA?",
        "query": """
SELECT TOP 1 FEC.ANIO, SUM(F.MONTO_PIA) AS TOTAL_PIA
FROM Gastos.FACT_GASTOS F
JOIN Generico.DIM_FECHA FEC ON F.Fecha_Key = FEC.Fecha_Key
GROUP BY FEC.ANIO
ORDER BY TOTAL_PIA DESC;
        """
    },
    {
        "question": "¿En qué año se tuvo el menor gasto de PIA?",
        "query": """
SELECT TOP 1 FEC.ANIO, SUM(F.MONTO_PIA) AS TOTAL_PIA
FROM Gastos.FACT_GASTOS F
JOIN Generico.DIM_FECHA FEC ON F.Fecha_Key = FEC.Fecha_Key
GROUP BY FEC.ANIO
ORDER BY TOTAL_PIA ASC;
        """
    },
    {
        "question": "¿En qué año se tuvo el mayor gasto de PIM?",
        "query": """
SELECT TOP 1 FEC.ANIO, SUM(F.MONTO_PIM) AS TOTAL_PIM
FROM Gastos.FACT_GASTOS F
JOIN Generico.DIM_FECHA FEC ON F.Fecha_Key = FEC.Fecha_Key
GROUP BY FEC.ANIO
ORDER BY TOTAL_PIM DESC;
        """
    },
    {
        "question": "¿En qué año se tuvo el menor gasto de PIM?",
        "query": """
SELECT TOP 1 FEC.ANIO, SUM(F.MONTO_PIM) AS TOTAL_PIM
FROM Gastos.FACT_GASTOS F
JOIN Generico.DIM_FECHA FEC ON F.Fecha_Key = FEC.Fecha_Key
GROUP BY FEC.ANIO
ORDER BY TOTAL_PIM ASC;
        """
    },
    {
        "question": "¿De dónde proviene principalmente el agua?",
        "query": """
SELECT TOP 1 ProcedenciaAgua, COUNT(*) AS CANTIDAD
FROM Enapres.FACT_ENAPRES
GROUP BY ProcedenciaAgua
ORDER BY CANTIDAD DESC;
        """
    },
    {
        "question": "¿De dónde proviene principalmente el agua en el departamento de Cajamarca?",
        "query": """
SELECT TOP 1 E.ProcedenciaAgua, COUNT(*) AS CANTIDAD
FROM Enapres.FACT_ENAPRES E
JOIN Generico.DIM_UBIGEO U ON E.Ubigeo_Key = U.Ubigeo_Key
WHERE U.DEPARTAMENTO = 'Cajamarca'
GROUP BY E.ProcedenciaAgua
ORDER BY CANTIDAD DESC;
        """
    },
    {
        "question": "¿De dónde proviene principalmente el agua en el año 2023?",
        "query": """
SELECT TOP 1 E.ProcedenciaAgua, COUNT(*) AS CANTIDAD
FROM Enapres.FACT_ENAPRES E
JOIN Generico.DIM_FECHA F ON E.Fecha_Key = F.Fecha_Key
WHERE F.ANIO = '2023'
GROUP BY E.ProcedenciaAgua
ORDER BY CANTIDAD DESC;
        """
    }
]
