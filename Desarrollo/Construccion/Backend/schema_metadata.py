schema = {
    "FACT_GASTOS": {
        "description": "Contiene información sobre los montos de ejecucion, pia y pim de los gastos publicos por departamento y fecha",
        "columns": {
            "Fecha_Key":{
                "description": "Clave unica de la fecha",
                "type": "int",
                "example": 202
            }, 
            "Grupo_Entidad_Key":{
                "description": "Clave unica del grupo de entidad",
                "type": "int",
                "example": 123
            }, 
            "Sec_Ejec_Key": {
                "description": "Clave unica de la sección de ejecución",
                "type": "int",
                "example": 456
            },
            "Ejecutora_Key": {
                "description": "Clave unica de la entidad ejecutora",
                "type": "int",
                "example": 789
            },
            "Ubigeo_Key": {
                "description": "Clave unica del ubigeo",
                "type": "int",
                "example": 101112
            },
            "Sec_Func_Key": {
                "description": "Clave unica de la sección funcional",
                "type": "int",
                "example": 131415
            },
            "Programa_Presupuesto_Key": {
                "description": "Clave unica del programa de presupuesto",
                "type": "int",
                "example": 161718
            },
            "Tipo_Proyecto_Key": {
                "description": "Clave unica del tipo de proyecto",
                "type": "int",
                "example": 192021
            },
            "Producto_Proyecto_Key": {
                "description": "Clave unica del producto del proyecto",
                "type": "int",
                "example": 222324
            },
            "Actividad_Key": {
                "description": "Clave unica de la actividad",
                "type": "int",
                "example": 252627
            },
            "Funcion_Key": {
                "description": "Clave unica de la funcion",
                "type": "int",
                "example": 282930
            },
            "Division_Funcional_Key": {
                "description": "Clave unica de la division funcional",
                "type": "int",
                "example": 313233
            },
            "Grupo_Funcional_Key": {
                "description": "Clave unica del grupo funcional",
                "type": "int",
                "example": 343536
            },
            "Meta_Key": {
                "description": "Clave unica de la meta",
                "type": "int",
                "example": 373839
            },
            "Financiamiento_Key": {
                "description": "Clave unica del financiamiento",
                "type": "int",
                "example": 404142
            },
            "Rubro_Key": {
                "description": "Clave unica del rubro",
                "type": "int",
                "example": 434445
            },
            "Categoria_Key": {
                "description": "Clave unica de la categoria",
                "type": "int",
                "example": 464748
            },
            "Tipo_Transaccion_Key": {
                "description": "Clave unica del tipo de transacción",
                "type": "int",
                "example": 495051
            },
            "Generica_Key": {
                "description": "Clave unica de la generica",
                "type": "int",
                "example": 525354
            },
            "MONTO_PIA": {
                "description": "Monto del PIA (Presupuesto Institucional de Apertura)",
                "type": "float",
                "example": 1000000.00
            },
            "MONTO_PIM": {
                "description": "Monto del PIM (Presupuesto Institucional Modificado)",
                "type": "float",
                "example": 1200000.00
            },
            "MONTO_EJECUCION": {
                "description": "Monto de ejecución del gasto",
                "type": "float",
                "example": 800000.00
            }
        },
        "joins": {
            "Fecha_Key": "Generico.DIM_FECHA.Fecha_Key",
            "Grupo_Entidad_Key": "Gastos.DIM_GRUPO_ENTIDAD.Grupo_Entidad_Key",
            "Sec_Ejec_Key": "Gastos.DIM_SEC_EJEC.SEC_Ejec_Key",
            "Ejecutora_Key": "Gastos.DIM_EJECUTORA.Ejecutora_Key",
            "Ubigeo_Key": "Generico.DIM_UBIGEO.Ubigeo_Key",
            "Sec_Func_Key": "Gastos.DIM_SEC_FUNC.SEC_Func_Key",
            "Programa_Presupuesto_Key": "Gastos.DIM_PROGRAMA_PRESUPUESTO.Programa_Presupuesto_Key",
            "Tipo_Proyecto_Key": "Gastos.DIM_TIPO_PROYECTO.Tipo_Proyecto_Key",
            "Producto_Proyecto_Key": "Gastos.DIM_PRODUCTO_PROYECTO.Producto_Proyecto_Key",
            "Actividad_Key": "Gastos.DIM_ACTIVIDAD.Actividad_key",
            "Funcion_Key": "Gastos.DIM_FUNCION.Funcion_Key",
            "Division_Funcional_Key": "Gastos.DIM_DIVISION_FUNCIONAL.Division_Funcional_Key",
            "Grupo_Funcional_Key": "Gastos.DIM_GRUPO_FUNCIONAL.Grupo_Funcional_Key",
            "Meta_Key": "Gastos.DIM_META.Meta_Key",
            "Financiamiento_Key": "Gastos.DIM_FINANCIAMIENTO.Financiamiento_Key",
            "Rubro_Key": "Gastos.DIM_RUBRO.Rubro_Key",
            "Categoria_Key": "Gastos.DIM_CATEGORIA.Categoria_Key",
            "Tipo_Transaccion_Key": "Gastos.DIM_TIPO_TRANSACCION.Tipo_Transaccion_Key",
            "Generica_Key": "Gastos.DIM_GENERICA.Generica_Key"
        },
        "source_system": "Gastos",
    },
    "FACT_ATM": {
        "description": "Contiene información relacionada con el acceso al agua potable y saneamiento en las ATM (Area Tecnica Municipal).",
        "columns": {
            "Municipalidad_Key": {
                "description": "Clave unica de la municipalidad",
                "type": "int",
                "example": 12345
            },
            "Ubicacion_Key": {
                "description": "Clave unica de la ubicación",
                "type": "int",
                "example": 67890
            },
            "Fecha_Key": {
                "description": "Clave unica de la fecha",
                "type": "int",
                "example": 20231001
            },
            "CCPP_TOTAL": {
                "description": "Número total de centros poblados existentes en el ámbito de la municipalidad",
                "type": "float",
                "example": 1500.00
            },
            "CCPP_SERV": {
                "description": "Número de centros poblados existentes con servicio de agua, en el ámbito de la municipalidad",
                "type": "float",
                "example": 1200.00
            },
            "CCPP_SIST_AGUA": {
                "description": "Número de centros poblados existentes con sistemas de agua, en el ámbito de la municipalidad",
                "type": "float",
                "example": 800.00
            },
            "CCPP_SIST_NCONV": {
                "description": "Número de centros poblados que cuentan con sistemas de agua no convencional",
                "type": "float",
                "example": 200.00
            },
            "CCPP_SIST_CONV": {
                "description": "Número de centros poblados que cuentan con sistemas de agua convencional en el ámbito de la municipalidad",
                "type": "float",
                "example": 600.00
            },
            "CCPP_ABAST_CCPP": {
                "description": "Número de centros poblados que se abastecen de agua de un centro poblado vecino",
                "type": "float",
                "example": 1000.00
            },
            "CCPP_HAB_01": {
                "description": "Numero de centros poblados entre 2001 y 15000 habitantes",
                "type": "float",
                "example": 5000.00
            },
            "CCPP_HAB_02": {
                "description": "Numero de centros poblados entre 2001 y 15000 habitantes con servicio de agua",
                "type": "float",
                "example": 4500.00
            },
            "CCPP_HAB_03": {
                "description": "Numero de centros poblados entre 2001 y 15000 habitantes, que son abastecidos por un centro poblado vecino",
                "type": "float",
                "example": 4000.00
            },
            "CCPP_MICROMED": {
                "description": "Número de centros poblados con micromedición en su conexión de agua",
                "type": "float",
                "example": 300.00
            },
            "MONTO_POI": {
                "description": "Monto considerado en el POI, que este asignado al Área Técnica Municipal para el presente año fiscal (S/.)",
                "type": "float",
                "example": 50000.00
            },
            "PRESTADOR_CUOTA": {
                "description": "Número de JASS  u otro tipo de organización comunal que realizan el cobro de la cuota familiar en los últimos seis meses",
                "type": "float",
                "example": 20.00
            },
            "PRESTADOR_CUOTA_INCREM": {
                "description": "Número de JASS  u otro tipo de organización comunal que incrementaron el monto de la cuota familiar en los últimos seis meses",
                "type": "float",
                "example": 5.00
            },
            "PRESTADOR_CUOTA_SUNASS": {
                "description": "Número de JASS  u otro tipo de organización comunal que apliquen la metodología aprobada por SUNASS para la fijación de la cuota familiar",
                "type": "float",
                "example": 15.00
            } 
        },
        "joins": {
            "Municipalidad_Key": "Atm.DIM_MUNICIPALIDAD.Municipalidad_Key",
            "Ubicacion_Key": "Atm.DIM_UBICACION_ATM.Ubicacion_Key",
            "Fecha_Key": "Generico.DIM_FECHA.Fecha_Key"
        },
        "source_system": "Atm",
    },    
    "FACT_ENAPRES": {
        "description": "Contiene información sobre el acceso al agua potable y saneamiento en las áreas rurales, según la Encuesta Nacional de Programas Estratégicos (ENAPRES).",
        "columns": {
            "Fecha_Key": {
                "description": "Clave unica de la fecha",
                "type": "int",
                "example": 20231001
            },
            "Ubigeo_Key": {
                "description": "Clave unica del ubigeo",
                "type": "int",
                "example": 123456
            },
            "129G": {
                "description": "Fuente principal de abastecimiento de agua del hogar (como opciones numericas)",
                "type": "nvarchar",
                "example": "1"
            },
            "129B": {
                "description": "Indica si el agua que consume el hogar es considerada potable (opciones: 1 = Sí, 2 = No)",
                "type": "nvarchar",
                "example": "1"
            },
            "130Z": {
                "description": "Señala si el hogar dispone del servicio de agua potable durante todos los días de la semana (1 = Sí, 2 = No)",
                "type": "nvarchar",
                "example": "1"
            },
            "130ZA": {
                "description": "Número promedio de horas diarias que el hogar recibe agua a través del sistema de abastecimiento",
                "type": "float",
                "example": 350.00
            },
            "130ZB2": {
                "description": "Número de días a la semana que el hogar tiene acceso al servicio de agua potable (entre 0 y 7 días)",
                "type": "float",
                "example": 300.00
            },
            "142A": {
                "description": "Identifica a qué sistema está conectado el baño o servicio higiénico del hogar (como opciones numericas)",
                "type": "nvarchar",
                "example": "publico"
            },
            "ProcedenciaAgua": {
                "description": "Fuente principal de abastecimiento de agua del hogar (red pública, pozo, manantial, río, camión cisterna, entre otros)",
                "type": "nvarchar",
                "example": "Red pública"
            },
            "DisponibilidadTodoDia": {
                "description": "Señala si el hogar dispone del servicio de agua potable durante todos los días de la semana (Sí,No)",
                "type": "nvarchar",
                "example": "Sí"
            },
            "Potabilidad": {
                "description": "Indica si el agua que consume el hogar es considerada potable (Sí,No)",
                "type": "nvarchar",
                "example": "Sí"
            },
            "ConexionServicioHigienico": {
                "description": "Identifica a qué sistema está conectado el baño o servicio higiénico del hogar (red pública, pozo séptico, letrina, campo abierto, otro)",
                "type": "nvarchar",
                "example": "Letrina"
            }
        },
        "joins": {
            "Ubigeo_Key": "Generico.DIM_UBIGEO.Ubigeo_Key",
            "Fecha_Key": "Generico.DIM_FECHA.Fecha_Key"
        },
        "source_system": "Enapres",
    },
    "DIM_ACTIVIDAD": {
        "description": "Contiene información sobre las actividades presupuestarias.",
        "columns": {
            "Actividad_key": {
                "description": "Clave unica de la actividad",
                "type": "int",
                "example": 123456
            },
            "ACTIVIDAD_ACCION_OBRA": {
                "description": "Código de la actividad de acción u obra",
                "type": "nvarchar",
                "example": "A123"
            },
            "ACTIVIDAD_ACCION_OBRA_NOMBRE": {
                "description": "Nombre de la actividad de acción u obra",
                "type": "nvarchar",
                "example": "Construcción de infraestructura educativa"
            }
        },
        "joins": {},
        "source_system": "Gastos",
    },
    "DIM_CATEGORIA": {
        "description": "Contiene información sobre las categorías de gasto.",
        "columns": {
            "Categoria_Key": {
                "description": "Clave unica de la categoria",
                "type": "int",
                "example": 123456
            },
            "CATEGORIA_GASTO": {
                "description": "Código de la categoría de gasto",
                "type": "nvarchar",
                "example": "CG01"
            },
            "CATEGORIA_GASTO_NOMBRE": {
                "description": "Nombre de la categoría de gasto",
                "type": "nvarchar",
                "example": "Gastos de personal"
            }
        },
        "joins": {},
        "source_system": "Gastos",
    },
    "DIM_DIVISION_FUNCIONAL": {
        "description": "Contiene información sobre las divisiones funcionales.",
        "columns": {
            "Division_Funcional_Key": {
                "description": "Clave unica de la division funcional",
                "type": "int",
                "example": 123456
            },
            "DIVISION_FUNCIONAL": {
                "description": "Código de la división funcional",
                "type": "int",
                "example": "DF01"
            },
            "DIVISION_FUNCIONAL_NOMBRE": {
                "description": "Nombre de la división funcional",
                "type": "int",
                "example": "División de Educación"
            }
        },
        "joins": {},
        "source_system": "Gastos",
    },
    "DIM_EJECUTORA": {
        "description": "Contiene información sobre las entidades ejecutoras de los gastos públicos.",
        "columns": {
            "Ejecutora_Key": {
                "description": "Clave unica de la entidad ejecutora",
                "type": "int",
                "example": 123456
            },
            "EJECUTORA": {
                "description": "Código de la entidad ejecutora",
                "type": "nvarchar",
                "example": "EJ01"
            },
            "EJECUTORA_NOMBRE": {
                "description": "Nombre de la entidad ejecutora",
                "type": "nvarchar",
                "example": "Ministerio de Educación"
            }
        },
        "joins": {},
        "source_system": "Gastos",
    }, 
    "DIM_FECHA": {
        "description": "Contiene información sobre las fechas utilizadas en los hechos.",
        "columns": {
            "Fecha_Key": {
                "description": "Clave unica de la fecha",
                "type": "int",
                "example": 20231001
            },
            "ANIO": {
                "description": "Año de la fecha",
                "type": "nvarchar",
                "example": "2023"
            },
            "MES": {
                "description": "Mes de la fecha",
                "type": "nvarchar",
                "example": "10"
            },
            "SEMESTRE": {
                "description": "Semestre de la fecha",
                "type": "nvarchar",
                "example": "SEM-I"
            }
        },
        "joins": {},
        "source_system": "Generico",
    },
    "DIM_FINANCIAMIENTO": {
        "description": "Contiene información sobre las fuentes de financiamiento de los gastos públicos.",
        "columns": {
            "Financiamiento_Key": {
                "description": "Clave unica del financiamiento",
                "type": "int",
                "example": 123456
            },
            "FUENTE_FINANCIAMIENTO": {
                "description": "Código de la fuente de financiamiento",
                "type": "nvarchar",
                "example": "FF01"
            },
            "FUENTE_FINANCIAMIENTO_NOMBRE": {
                "description": "Nombre de la fuente de financiamiento",
                "type": "nvarchar",
                "example": "Fondo General de la Nación"
            }
        },
        "joins": {},
        "source_system": "Gastos",
    },
    "DIM_FUNCION": {
        "description": "Contiene información sobre las funciones del gasto público.",
        "columns": {
            "Funcion_Key": {
                "description": "Clave unica de la función",
                "type": "int",
                "example": 123456
            },
            "FUNCION": {
                "description": "Código de la función",
                "type": "nvarchar",
                "example": "F01"
            },
            "FUNCION_NOMBRE": {
                "description": "Nombre de la función",
                "type": "nvarchar",
                "example": "Educación"
            }
        },
        "joins": {},
        "source_system": "Gastos",
    },
    "DIM_GENERICA": {
        "description": "Contiene información sobre las partidas genéricas del gasto público.",
        "columns": {
            "Generica_Key": {
                "description": "Clave unica de la partida genérica",
                "type": "int",
                "example": 123456
            },
            "GENERICA": {
                "description": "Código de la partida genérica",
                "type": "nvarchar",
                "example": "G01"
            },
            "GENERICA_NOMBRE": {
                "description": "Nombre de la partida genérica",
                "type": "nvarchar",
                "example": "Gastos de Personal"
            },
            "SUBGENERICA": {
                "description": "Código de la subgenérica",
                "type": "nvarchar",
                "example": "SG01"
            },
            "SUBGENERICA_NOMBRE": {
                "description": "Nombre de la subgenérica",
                "type": "nvarchar",
                "example": "Remuneraciones"
            },
            "SUBGENERICA_DET": {
                "description": "Código de la subgenérica detallada",
                "type": "nvarchar",
                "example": "SGD01"
            },
            "SUBGENERICA_DET_NOMBRE": {
                "description": "Nombre de la subgenérica detallada",
                "type": "nvarchar",
                "example": "Remuneraciones del Personal Docente"
            },
            "ESPECIFICA": {
                "description": "Código de la partida específica",
                "type": "nvarchar",
                "example": "E01"
            },
            "ESPECIFICA_NOMBRE": {
                "description": "Nombre de la partida específica",
                "type": "nvarchar",
                "example": "Gastos de Mantenimiento"
            },
            "ESPECIFICA_DET": {
                "description": "Código de la partida específica detallada",
                "type": "nvarchar",
                "example": "ED01"
            },
            "ESPECIFICA_DET_NOMBRE": {
                "description": "Nombre de la partida específica detallada",
                "type": "nvarchar",
                "example": "Mantenimiento de Infraestructura Educativa"
            }
        },
        "joins": {},
        "source_system": "Gastos",
    },
    "DIM_GRUPO_ENTIDAD": {
        "description": "Contiene información sobre los grupos de entidades del gasto público.",
        "columns": {
            "Grupo_Entidad_Key": {
                "description": "Clave unica del grupo de entidad",
                "type": "int",
                "example": 123456
            },
            "GRUPO_ENTIDAD": {
                "description": "Código del grupo de entidad",
                "type": "nvarchar",
                "example": "GE01"
            },
            "GRUPO_ENTIDAD_NOMBRE": {
                "description": "Nombre del grupo de entidad",
                "type": "nvarchar",
                "example": "Ministerios"
            }
        },
        "joins": {},
        "source_system": "Gastos",
    },
    "DIM_GRUPO_FUNCIONAL": {
        "description": "Contiene información sobre los grupos funcionales del gasto público.",
        "columns": {
            "Grupo_Funcional_Key": {
                "description": "Clave unica del grupo funcional",
                "type": "int",
                "example": 123456
            },
            "GRUPO_FUNCIONAL": {
                "description": "Código del grupo funcional",
                "type": "nvarchar",
                "example": "GF01"
            },
            "GRUPO_FUNCIONAL_NOMBRE": {
                "description": "Nombre del grupo funcional",
                "type": "nvarchar",
                "example": "Educación y Cultura"
            }
        },
        "joins": {},
        "source_system": "Gastos",
    },
    "DIM_META": {
        "description": "Contiene información sobre las metas del gasto público.",
        "columns": {
            "Meta_Key": {
                "description": "Clave unica de la meta",
                "type": "int",
                "example": 123456
            },
            "META": {
                "description": "Código de la meta",
                "type": "nvarchar",
                "example": "M01"
            },
            "FINALIDAD": {
                "description": "Finalidad de la meta",
                "type": "nvarchar",
                "example": "Mejorar la calidad educativa"
            },
            "META_NOMBRE": {
                "description": "Nombre de la meta",
                "type": "nvarchar",
                "example": "Incrementar el número de estudiantes matriculados"
            }
        },
        "joins": {},
        "source_system": "Gastos",
    },
    "DIM_MUNICIPALIDAD": {
        "description": "Contiene información sobre las municipalidades.",
        "columns": {
            "Municipalidad_Key": {
                "description": "Clave unica de la municipalidad",
                "type": "int",
                "example": 123456
            },
            "ATM": {
                "description": "Nombre del  Área Técnica Municipal o en su defecto nombre de la municipalidad",
                "type": "nvarchar",
                "example": "ATM01"
            },
            "ALCALDE": {
                "description": "Nombre del alcalde de la municipalidad",
                "type": "nvarchar",
                "example": "Juan Pérez"
            },
            "ATM_GESTION": {
                "description": "Gestión del Área Técnica Municipal",
                "type": "nvarchar",
                "example": "2023-2026"
            },
            "UNIDAD_ORGANICA": {
                "description": "Unidad orgánica de la municipalidad",
                "type": "nvarchar",
                "example": "Unidad de Saneamiento"
            },
            "CODIGO": {
                "description": "Código único de la municipalidad",
                "type": "nvarchar",
                "example": "MUNI123"
            }
        },
        "joins": {},
        "source_system": "Atm",
    },
    "DIM_PRODUCTO_PROYECTO": {
        "description": "Contiene información sobre los productos de los proyectos.",
        "columns": {
            "Producto_Proyecto_Key": {
                "description": "Clave unica del producto del proyecto",
                "type": "int",
                "example": 123456
            },
            "PRODUCTO_PROYECTO": {
                "description": "Código del producto del proyecto",
                "type": "nvarchar",
                "example": "PP01"
            },
            "PRODUCTO_PROYECTO_NOMBRE": {
                "description": "Nombre del producto del proyecto",
                "type": "nvarchar",
                "example": "Construcción de aulas escolares"
            }
        },
        "joins": {},
        "source_system": "Gastos",
    },    
    "DIM_PROGRAMA_PRESUPUESTO": {
        "description": "Contiene información sobre los programas de presupuesto.",
        "columns": {
            "Programa_Presupuesto_Key": {
                "description": "Clave unica del programa de presupuesto",
                "type": "int",
                "example": 123456
            },
            "PROGRAMA_PPTO": {
                "description": "Código del programa de presupuesto",
                "type": "nvarchar",
                "example": "PP01"
            },
            "PROGRAMA_PPTO_NOMBRE": {
                "description": "Nombre del programa de presupuesto",
                "type": "nvarchar",
                "example": "Programa de Infraestructura Educativa"
            }
        },
        "joins": {},
        "source_system": "Gastos",
    },
    "DIM_RUBRO": {
        "description": "Contiene información sobre los rubros del gasto público.",
        "columns": {
            "Rubro_Key": {
                "description": "Clave unica del rubro",
                "type": "int",
                "example": 123456
            },
            "RUBRO": {
                "description": "Código del rubro",
                "type": "nvarchar",
                "example": "R01"
            },
            "RUBRO_NOMBRE": {
                "description": "Nombre del rubro",
                "type": "nvarchar",
                "example": "Gastos de Mantenimiento"
            }
        },
        "joins": {},
        "source_system": "Gastos",
    },    
    "DIM_SEC_EJEC": {
        "description": "Contiene información sobre las secciones de ejecución del gasto público.",
        "columns": {
            "Sec_Ejec_Key": {
                "description": "Clave unica de la sección de ejecución",
                "type": "int",
                "example": 123456
            },
            "SEC_EJEC": {
                "description": "Código de la sección de ejecución",
                "type": "nvarchar",
                "example": "SE01"
            },
            "SEC_EJEC_NOMBRE": {
                "description": "Nombre de la sección de ejecución",
                "type": "nvarchar",
                "example": "Sección de Ejecución de Proyectos"
            }
        },
        "source_system": "Gastos",
    },
    "DIM_SEC_FUNC": {
        "description": "Contiene información sobre las secciones funcionales del gasto público.",
        "columns": {
            "Sec_Func_Key": {
                "description": "Clave unica de la sección funcional",
                "type": "int",
                "example": 123456
            },
            "SEC_FUNC": {
                "description": "Código de la sección funcional",
                "type": "nvarchar",
                "example": "SF01"
            },
            "SEC_FUNC_NOMBRE": {
                "description": "Nombre de la sección funcional",
                "type": "nvarchar",
                "example": "Sección Funcional de Educación"
            }
        },
        "joins": {},
        "source_system": "Gastos",
    },    
    "DIM_TIPO_PROYECTO": {
        "description": "Contiene información sobre los tipos de proyectos.",
        "columns": {
            "Tipo_Proyecto_Key": {
                "description": "Clave unica del tipo de proyecto",
                "type": "int",
                "example": 123456
            },
            "TIPO_ACT_PROY": {
                "description": "Código del tipo de actividad del proyecto",
                "type": "nvarchar",
                "example": "TAP01"
            },
            "TIPO_ACT_PROY_NOMBRE": {
                "description": "Nombre del tipo de actividad del proyecto",
                "type": "nvarchar",
                "example": "Construcción de Infraestructura"
            }
        },
        "joins": {},
        "source_system": "Gastos",
    },
    "DIM_TIPO_TRANSACCION": {
        "description": "Contiene información sobre los tipos de transacciones del gasto público.",
        "columns": {
            "Tipo_Transaccion_Key": {
                "description": "Clave unica del tipo de transacción",
                "type": "int",
                "example": 123456
            },
            "TIPO_TRANSACCION": {
                "description": "Código del tipo de transacción",
                "type": "nvarchar",
                "example": "TT01"
            },
            "TIPO_TRANSACCION_NOMBRE": {
                "description": "Nombre del tipo de transacción",
                "type": "nvarchar",
                "example": "Pago a Proveedores"
            }
        },
        "joins": {},
        "source_system": "Gastos",
    },        
    "DIM_UBICACION_ATM": {
        "description": "Contiene información sobre las ubicaciones de las ATM (Áreas Técnicas Municipales).",
        "columns": {
            "Ubicacion_Key": {
                "description": "Clave unica de la ubicación",
                "type": "int",
                "example": 123456
            },
            "DEPARTAMENTO": {
                "description": "Nombre del departamento",
                "type": "nvarchar",
                "example": "Lima"
            },
            "PROVINCIA": {
                "description": "Nombre de la provincia",
                "type": "nvarchar",
                "example": "Lima"
            }
        },
        "joins": {},
        "source_system": "Atm",
    },  
    "DIM_UBIGEO": {
        "description": "Contiene información sobre los ubigeos utilizados en los hechos.",
        "columns": {
            "Ubigeo_Key": {
                "description": "Clave unica del ubigeo",
                "type": "int",
                "example": 123456
            },
            "UBIGEO_ID": {
                "description": "ID del ubigeo",
                "type": "nvarchar",
                "example": "150101"
            },
            "UBIGEO_RENIEC": {
                "description": "Código del ubigeo según RENIEC",
                "type": "nvarchar",
                "example": "150101"
            },
            "UBIGEO_INEI": {
                "description": "Código del ubigeo según INEI",
                "type": "nvarchar",
                "example": "150101"
            },
            "DEPARTAMENTO_INEI": {
                "description": "Nombre del departamento según INEI",
                "type": "nvarchar",
                "example": "Lima"
            },
            "DEPARTAMENTO": {
                "description": "Nombre del departamento",
                "type": "nvarchar",
                "example": "Lima"
            },
            "PROVINCIA_INEI": {
                "description": "Nombre de la provincia según INEI",
                "type": "nvarchar",
                "example": "Lima"
            },
            "PROVINCIA": {
                "description": "Nombre de la provincia",
                "type": "nvarchar",
                "example": "Lima"
            },
            "DISTRITO": {
                "description": "Nombre del distrito",
                "type": "nvarchar",
                "example": "Lima"
            },
            "REGION": {
                "description": " Nombre de la región a la que pertenece el ubigeo.",
                "type": "nvarchar",
                "example": "Región Lima Metropolitana"
            },
            "MACROREGION_INEI": {
              "description": " Nombre de la macroregión según INEI.",
              "type": "nvarchar",
              "example": "Macroregión Centro"
            },
            "MACROREGION_MINSA": {
              "description": " Nombre de la macroregión según MINSA.",
              "type": "nvarchar",
              "example": "Macroregión Centro"
            },
            "CODIGO_FIPS": {
              "description": " Código FIPS del ubigeo.",
              "type": "nvarchar",
                "example": "PE-15"
            },
            "SUPERFICIE": {
                "description": " Superficie del ubigeo en km².",
                "type": "float",
                "example": 123.45
            },
            "ALTITUD": {
                "description": " Altitud del ubigeo en metros sobre el nivel del mar.",
                "type": "float",
                "example": 1500.0
            },
            "LATITUD": {
                "description": " Latitud del ubigeo.",
                "type": "float",
                "example": -12.0464
            },
            "LONGITUD": {
                "description": " Longitud del ubigeo.",
                "type": "float",
                "example": -77.0428
            },
            "POBLACION_DISTRITO": {
                "description": " Población del distrito.",
                "type": "int",
                "example": 100000
            },
            "POBLACION_PROVINCIA": {
                "description": " Población de la provincia.",
                "type": "int",
                "example": 500000
            },
            "POBLACION_DEPARTAMENTO": {
                "description": " Población del departamento.",
                "type": "int",
                "example": 1000000
            },
            "DIRESA": {
                "description": " Dirección Regional de Salud a la que pertenece el ubigeo.",
                "type": "nvarchar",
                "example": "DIRESA Lima"
            }
        },
        "joins": {},
        "source_system": "Generico",
    }          
}
