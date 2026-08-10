# Proyecto: Sistema de aprendizaje personalizado con IA

> Transcripción y síntesis de la conversación sobre la idea de construir una plataforma de aprendizaje con IA, MCP, API, memoria pedagógica y múltiples clientes.

---

## 1. Idea inicial

**Usuario:**

Necesito que me ayudes a pensar y a entender la siguiente idea.

Quiero crear algo para que mis compañeros de la universidad estudien. Cosas como Python, bases de datos, matemática. Pero no quiero cerrarlo únicamente a eso. Quiero que se pueda aprender relativamente lo que quieras.

Quiero utilizar inteligencia artificial para esto.

A la hora de aprender algo, necesitas recursos teóricos y recursos prácticos. La guía funcionaría como un tutor teórico y práctico. Incluso se podría combinar teoría y práctica.

El problema es que para matemática, programación y bases de datos no se usan los mismos entornos.

- Matemática puede requerir papel, Google Sheets, etc.
- Programación requiere un entorno de código.
- Bases de datos requieren un entorno SQL.

Además, si se estudian bases de datos, uno quiere utilizar la teoría del profesor, porque quiere aprender como el profesor lo está enseñando, no necesariamente como aparece en Internet.

Por lo tanto, el agente tendría que aprender cómo enseñar y también conocer muchos parámetros del estudiante para que la enseñanza sea específica y personalizada.

Por ejemplo, si el estudiante no entiende abstracciones o inglés, no debería empezar a utilizar constantemente términos en inglés. Debería utilizar los términos empleados en clase.

También pensé en una herramienta CLI que tenga una API y un MCP, para que cada sesión de aprendizaje quede relativamente registrada y con eso el agente vaya, entre comillas, "aprendiendo".

Sería algo así como un harness sobre un harness.

No quiero necesariamente darles los modelos a los estudiantes. Quiero que, por ejemplo, si tienen Claude Code, puedan conectarse mediante MCP a este sistema.

Quizás ni siquiera necesite una CLI, sino un conjunto de tools, skills, subagentes y agentes.

También pensé en tener un hub con los contenidos.

Por ejemplo, si tenemos todos los PDFs de Análisis Matemático, el agente no debería buscar en Internet todo el tiempo. Debería enseñar como el profesor está enseñando.

Podría haber:

- Recursos de la cátedra.
- Recursos de terceros.

Y el agente debería indicar cuándo utiliza recursos de terceros y cuándo utiliza recursos de la cátedra.

---

## 2. Primera interpretación de la idea

**Respuesta:**

La idea se parece menos a un "chat con RAG" y mucho más a un **sistema operativo para el aprendizaje**.

La diferencia es importante.

La mayoría de los proyectos de "IA para estudiar" parten de la premisa de que el conocimiento es el problema.

La idea planteada parte de que el problema es **el proceso de aprendizaje**.

Eso cambia completamente la arquitectura.

Se propusieron cinco capas.

---

## 3. Capa de conocimiento

Esta capa responde:

> ¿Qué sabe el sistema?

No sería solamente un RAG.

Se propuso separar:

### Material de la cátedra

- PDFs
- Apuntes
- Presentaciones
- TP
- Exámenes viejos

### Recursos externos

- Libros
- Wikipedia
- Documentación oficial
- StackOverflow
- Internet

### Recursos generados

- Resúmenes
- Flashcards
- Explicaciones propias

Cada documento podría tener metadata como:

```text
tipo
materia
tema
subtema
profesor
año
dificultad
autor
prioridad
```

El agente podría decidir:

```text
Responder únicamente con material de la cátedra.

Responder primero con la cátedra y luego complementar.

Ignorar completamente Internet.

Buscar primero Internet.
```

La conclusión fue que esto es más potente que un RAG tradicional.

---

## 4. Capa pedagógica

Esta sería una de las partes centrales.

No se quiere simplemente un LLM.

Se quiere un **profesor**.

Un profesor:

- Detecta errores.
- Hace preguntas.
- Decide cuándo explicar.
- Decide cuándo callarse.
- Decide cuándo dar pistas.
- Decide cuándo evaluar.
- Decide cuándo volver a explicar.

Ejemplo:

```text
Alumno:
No entiendo JOIN.

Tutor:
Antes de explicarlo...

¿Recordás qué hace una FK?
```

En lugar de responder directamente.

Otro ejemplo:

```text
Alumno:
No puedo hacer este ejercicio.

Tutor:
Mostrame qué intentaste.
```

La idea es guiar, no simplemente resolver.

---

## 5. Capa de memoria

Se consideró fundamental no limitar la memoria a guardar chats.

El sistema debería guardar **estado de aprendizaje**.

Ejemplo:

```text
Franco

Python

Variables
✔

Funciones
✔

Recursión
✘

POO
En progreso

Decoradores
Nunca visto
```

También errores frecuentes:

```text
Errores frecuentes

- Confunde lista y tupla.
- Siempre olvida range().
- Le cuesta la recursión.
- Entiende muy bien diagramas.
```

Y preferencias:

```text
Preferencias

Prefiere ejemplos.

No entiende bien analogías.

No usar demasiado inglés.

Explicar paso a paso.
```

La conclusión fue:

> Guardar el estado del alumno es mucho más valioso que simplemente guardar conversaciones.

---

## 6. Capa de herramientas

Se destacó que distintas materias requieren diferentes entornos.

El agente podría necesitar decidir:

```text
Necesito abrir un notebook.
```

o:

```text
Necesito abrir una consola SQL.
```

o:

```text
Necesito abrir GeoGebra.
```

o:

```text
Necesito usar Google Sheets.
```

o:

```text
Necesito dibujar un gráfico.
```

El LLM no debería resolver todo.

Debería saber **cuándo delegar a una herramienta**.

Esto llevó a pensar en un sistema de herramientas desacopladas en lugar de un agente monolítico.

---

## 7. Capa de estrategia

Se consideró especialmente importante que el sistema no organice el aprendizaje solamente por temas, sino por objetivos.

Ejemplo:

```text
Quiero aprobar el parcial.
```

El sistema podría construir:

```text
Objetivo
   ↓
Temas
   ↓
Dependencias
   ↓
Ejercicios
   ↓
Evaluación
   ↓
Refuerzo
```

Esto es distinto de:

```text
Explicame Python.
```

---

## 8. Modelo de estudiante

Se planteó que el agente debería aprender cómo enseñar a cada persona.

Esto implica dos modelos:

### Modelo del conocimiento

```text
¿Qué sabe el alumno?
```

### Modelo del estudiante

```text
¿Cómo aprende?
```

Ejemplos:

```text
Alumno A
Aprende leyendo.
```

```text
Alumno B
Aprende haciendo ejercicios.
```

```text
Alumno C
Aprende mejor con ejemplos visuales.
```

```text
Alumno D
Se pierde cuando aparecen muchas abstracciones.
```

Esto permitiría adaptar la explicación.

---

## 9. No construir una CLI como núcleo

Se planteó que una CLI puede ser útil para usuarios técnicos, pero que no debería ser el núcleo del sistema.

La arquitectura propuesta fue:

```text
                 Web
                  │
              VSCode
                  │
             Claude Code
                  │
               Cursor
                  │
              Terminal
                  │
              Discord
                  │
              Telegram
                  │
          Learning Core
```

Todos los clientes utilizarían el mismo núcleo.

La sesión y el estado vivirían en el Core.

---

## 10. Skills

Se propuso no crear un único agente gigante, sino habilidades especializadas.

Ejemplos:

```text
Skill
Explicar concepto
```

```text
Skill
Generar ejercicios
```

```text
Skill
Corregir ejercicios
```

```text
Skill
Detectar lagunas
```

```text
Skill
Evaluar conocimiento
```

```text
Skill
Crear examen
```

```text
Skill
Crear flashcards
```

```text
Skill
Generar roadmap
```

```text
Skill
Comparar respuestas
```

Cada skill debería hacer una tarea relativamente concreta.

---

## 11. Grafo de conocimiento

Se identificó una pieza adicional importante: un **modelo explícito del dominio**.

Las materias no deberían ser solamente colecciones de documentos.

Podrían modelarse como grafos de conocimiento.

### Programación

```text
Variables
    │
Funciones
    │
Parámetros
    │
Retorno
    │
POO
    │
Herencia
```

### Matemática

```text
Límites
    │
Continuidad
    │
Derivadas
    │
Aplicaciones
```

El tutor no solo conocería cada nodo, sino también sus dependencias.

Si un estudiante falla en `JOIN`, el sistema podría inferir que quizá todavía no domina claves primarias y foráneas.

Si falla en derivadas, podría revisar primero límites.

El grafo permitiría razonar sobre el aprendizaje, no solamente sobre documentos.

---

## 12. Visión resumida

Se llegó a esta definición:

> **No estás construyendo un chatbot para estudiar. Estás construyendo una plataforma donde los LLM son solo un componente dentro de un sistema pedagógico que conoce el contenido, el recorrido del estudiante, sus herramientas de trabajo y la estrategia de enseñanza.**

La idea busca resolver algo que los modelos actuales no resuelven completamente:

- Qué sabe el alumno.
- Qué no sabe.
- Cómo aprende.
- Qué debería estudiar después.
- Qué recursos debe utilizar.
- Cuándo debe recibir teoría.
- Cuándo debe practicar.
- Cuándo debe ser evaluado.

---

# 13. ¿Cómo interactuar con la aplicación?

**Usuario:**

OK. Me estás diciendo que haga una app, pero ¿cómo interactúo con esa app? ¿A través de un MCP? Claro, para eso usaría Claude Code, ¿verdad? ¿Y cómo construyo esta API? ¿Cómo hago todo esto?

---

## 14. Separación entre cliente, MCP y aplicación

Se propuso separar:

```text
                Claude Code
                    │
                (MCP Client)
                    │
        ┌───────────┴───────────┐
        │                       │
 Knowledge Server         Learning Server
        │                       │
 PDFs                  Perfil del alumno
 RAG                   Memoria
 Embeddings            Roadmaps
 Índices               Progreso
```

La idea fundamental fue:

> **Claude Code es solamente el cliente. No es la aplicación.**

---

# 15. Learning Core

Se propuso construir un backend/API sin interfaz.

Podría exponer endpoints como:

```text
POST /session/start

POST /exercise/check

POST /lesson/explain

POST /student/profile

POST /student/update

POST /roadmap/generate

POST /memory/store

GET /memory

GET /course/python
```

El backend podría implementarse con:

- FastAPI
- Next.js API
- NestJS
- Go

---

# 16. MCP Server

El MCP no debería contener toda la lógica.

Su función sería exponer herramientas al modelo.

Ejemplos:

```text
tools

learn()

createExercise()

correctExercise()

searchNotes()

getProfessorMaterial()

rememberStudent()

getRoadmap()

generateExam()

evaluateKnowledge()
```

La comunicación sería:

```text
Claude
   ↓
Tool
   ↓
API
   ↓
Learning Core
```

El modelo no debería tocar directamente:

- PostgreSQL.
- La base vectorial.
- Los archivos.
- La lógica de negocio.

---

# 17. ¿Por qué no hacer todo dentro del MCP?

Porque posteriormente podrían existir múltiples clientes:

```text
Web
  ↓
Learning API
```

```text
Aplicación Android
  ↓
Learning API
```

```text
Discord Bot
  ↓
Learning API
```

```text
WhatsApp
  ↓
Learning API
```

Todos reutilizarían exactamente el mismo núcleo.

---

# 18. Múltiples MCP

También se planteó dividir las herramientas en varios MCP.

### Knowledge MCP

```text
search_material()
find_examples()
search_exams()
```

### Student MCP

```text
load_profile()
save_progress()
update_preferences()
history()
```

### Exercise MCP

```text
generate()
correct()
hint()
evaluate()
```

### Planning MCP

```text
roadmap()
study_plan()
review_schedule()
```

Claude podría decidir cuál utilizar.

---

# 19. Skills vs Tools

Se propuso una distinción:

Las **tools** serían capacidades concretas.

Las **skills** serían orquestaciones de esas herramientas.

Ejemplo:

```text
Skill:
Explicar concepto
```

Podría ejecutar:

```text
search_material()
↓
load_student()
↓
lesson/explain()
```

Otra skill:

```text
Corregir ejercicio
```

Podría ejecutar:

```text
load_attempt()
↓
correct()
↓
remember()
```

Por lo tanto:

> Las skills son orquestaciones de herramientas, no herramientas en sí.

---

# 20. Arquitectura propuesta

```text
                  Claude Code
                       │
                 (MCP Client)
                       │
      ┌────────────────┼────────────────┐
      │                │                │
 Knowledge MCP    Student MCP    Exercise MCP
      │                │                │
      └────────────────┼────────────────┘
                       │
                 Learning API
                       │
      ┌────────────────┼─────────────────┐
      │                │                 │
 PostgreSQL     Vector Database      File Storage
      │                │                 │
 Progreso        Embeddings         PDFs, PPT, DOCX
```

---

# 21. ¿Claude o ChatGPT?

**Usuario:**

¿Y esto lo usarías dentro de Claude o ChatGPT?

---

## 22. Respuesta conceptual

La idea fue:

> Ninguno de los dos exclusivamente, y ambos al mismo tiempo.

### Claude Code

Durante el desarrollo y para usuarios técnicos, Claude Code sería un cliente natural porque permite trabajar con MCP.

El flujo:

```text
Claude Code
      │
      ▼
Learning MCP
      │
      ▼
Learning API
      │
      ▼
Base de datos + RAG
```

El usuario podría pedir:

> "Quiero preparar el parcial de Bases de Datos."

Y Claude podría llamar herramientas como:

```text
load_student_profile()
search_professor_material()
generate_study_plan()
create_exercise()
```

---

## 23. ChatGPT

La misma lógica podría exponerse a ChatGPT mediante los mecanismos de integración que soporte la plataforma.

La idea importante es que el backend no debería depender de ChatGPT.

```text
ChatGPT
   │
   ▼
Learning API
```

O, si el mecanismo de integración lo permite:

```text
ChatGPT
   ↓
Learning MCP
   ↓
Learning API
```

---

# 24. Aplicación propia

También se planteó construir eventualmente una aplicación específica para estudiar.

Ejemplo conceptual:

```text
┌──────────────────────────────────────┐
│ Curso: Python I                      │
├──────────────────────────────────────┤
│ ✔ Variables                          │
│ ✔ Funciones                          │
│ ◉ Listas                             │
│ ○ Diccionarios                       │
│ ○ POO                                │
├──────────────────────────────────────┤
│ Chat con el tutor                    │
│                                      │
│ "No entiendo list comprehensions."   │
│                                      │
├──────────────────────────────────────┤
│ Ejercicio actual                     │
│ Editor de código                     │
│ Terminal                             │
│ Tests                                │
└──────────────────────────────────────┘
```

La idea es que esto ya no sea simplemente un chat, sino un **entorno de aprendizaje**.

---

# 25. Principio arquitectónico importante

La recomendación fue:

> No construir un producto para Claude ni un producto para ChatGPT.

Construir un producto cuyo contrato sea:

1. Una API.
2. Un conjunto de herramientas.
3. Un sistema de conocimiento.
4. Un sistema de memoria pedagógica.

Así:

```text
Hoy:
Claude Code

Mañana:
ChatGPT

Después:
Gemini

También:
Modelo local

Y eventualmente:
Aplicación web propia
```

El LLM se convierte en un componente intercambiable.

---

# 26. Especificaciones técnicas propuestas

**Usuario:**

¿Puedes pasarme las especificaciones técnicas y cómo hacerlo?

---

## 27. Arquitectura técnica

La arquitectura propuesta:

```text
                        Cliente

     Claude Code
     ChatGPT
     Aplicación Web
     VSCode
     Discord

                │

         Learning MCP

                │

          Learning API

                │

    ┌───────────┼────────────┐
    │           │            │

Knowledge   Student     Learning

    │           │            │

 PostgreSQL    Vector DB     Object Storage
```

---

# 28. Stack backend

Se recomendó:

```text
Python
FastAPI
SQLAlchemy
Pydantic
Alembic
asyncio
```

### Motivo

Python permite trabajar cómodamente con:

- IA.
- Embeddings.
- OCR.
- Parsing.
- Matemática.
- NLP.
- RAG.
- Data science.

---

# 29. Base de datos

Se recomendó:

```text
PostgreSQL
```

En lugar de MongoDB.

La razón es que existen muchas relaciones:

```text
Student
   ↓
Course
   ↓
Topic
   ↓
Exercise
   ↓
Attempt
```

Este tipo de estructura encaja naturalmente con SQL.

---

# 30. Vector database

Se propuso inicialmente:

```text
pgvector
```

dentro de PostgreSQL.

La recomendación fue evitar introducir desde el comienzo sistemas adicionales como:

- Pinecone.
- Weaviate.
- Milvus.

Para el alcance inicial, PostgreSQL + pgvector simplificaría el despliegue.

---

# 31. Storage

Los recursos podrían almacenarse como:

```text
PDF
DOCX
PPTX
Markdown
HTML
```

en:

- almacenamiento local durante desarrollo;
- S3 o almacenamiento compatible durante producción.

---

# 32. Servicios

## Knowledge Service

Responsable de:

```text
indexar PDFs
buscar contenido
buscar ejercicios
buscar ejemplos
buscar teoría
```

---

## Student Service

Responsable de:

```text
perfil
preferencias
progreso
sesiones
errores frecuentes
```

---

## Pedagogy Service

Se identificó como una de las partes más importantes.

Funciones:

```text
explain()
quiz()
hint()
roadmap()
evaluate()
adaptDifficulty()
review()
```

Este servicio no debería depender directamente de cómo se almacenan los PDFs o embeddings.

Su responsabilidad es enseñar.

---

## Exercise Service

Responsable de:

```text
Generar ejercicios
Corregir
Dar pistas
Calificar
Guardar intentos
```

---

## Course Service

Responsable de los cursos:

```text
Python
SQL
Álgebra
Análisis
IA
etc.
```

---

# 33. API propuesta

Se propuso REST:

```text
POST /students

GET /students/{id}

PATCH /students/{id}

GET /courses

GET /topics

POST /lesson/start

POST /lesson/explain

POST /lesson/question

POST /exercise/generate

POST /exercise/check

POST /roadmap

POST /review
```

---

# 34. Herramientas MCP

Ejemplos:

```text
load_student()

save_progress()

search_material()

generate_quiz()

correct_exercise()

generate_exam()

roadmap()

remember()

search_examples()

explain_topic()
```

El MCP debería actuar como una interfaz para el agente, no como reemplazo de la API.

---

# 35. Modelo de datos

### Students

```text
id
name
preferences
learning_style
english_level
```

### Courses

```text
id
name
description
```

### Topics

```text
id
course_id
parent_topic
difficulty
```

### Student Topics

```text
student
topic
mastery
last_review
confidence
```

### Documents

```text
id
title
source
course
teacher
year
```

### Chunks

```text
document
embedding
text
```

### Attempts

```text
exercise
student
score
mistakes
feedback
```

---

# 36. Motor pedagógico

El tutor no debería responder directamente.

El flujo sería:

```text
Alumno pregunta
      ↓
Buscar perfil
      ↓
Buscar progreso
      ↓
Buscar teoría
      ↓
Buscar ejercicios
      ↓
Elegir estrategia
      ↓
Responder
```

La información sobre el estudiante debería formar parte del contexto antes de generar una respuesta.

---

# 37. Estrategias pedagógicas

Ejemplo:

### Beginner

```text
Muchos ejemplos
Mucho paso a paso
Sin abstracciones innecesarias
```

### Advanced

```text
Más teoría
Más demostraciones
Más profundidad
```

### Visual

```text
Diagramas
Tablas
Analogías
```

Estas son solo estrategias iniciales; el sistema podría aprender qué estrategias funcionan mejor para cada alumno.

---

# 38. Materias como plugins

No se debería codificar directamente Python o SQL en el core.

Todo debería ser extensible.

Ejemplo:

```text
courses/

python/

database/

algebra/

statistics/

ai/
```

Cada curso podría contener:

```text
metadata.yaml

prompt.md

skills/

roadmap.json

rubrics.json
```

De esta forma, agregar una materia sería principalmente agregar un nuevo **course pack**.

---

# 39. Memoria del estudiante

Se reforzó que no conviene guardar solamente conversaciones.

Ejemplo:

```text
El alumno:

No domina JOIN

Confunde FK con PK

Necesita más ejercicios

Aprende mejor con ejemplos

No usar inglés

Última sesión:
Hace 3 días
```

Esta información debería alimentar las decisiones del tutor.

---

# 40. Fuentes y embeddings

Se propuso separar las fuentes.

### Material del profesor

```text
Profesor
   ↓
PDFs
   ↓
Apuntes
   ↓
Diapositivas
```

### Fuentes externas

```text
Internet
   ↓
Documentación
   ↓
Wikipedia
   ↓
Libros
```

Esto permite que el tutor indique:

> "La siguiente explicación está basada exclusivamente en el material de la cátedra."

O:

> "No encontré esa información en el material del profesor, así que la complemento con documentación oficial."

---

# 41. Un cambio importante: el LLM no debe "aprender" directamente

Se propuso no permitir que el LLM modifique directamente el perfil del alumno.

En su lugar, el modelo genera observaciones estructuradas.

Ejemplo:

```json
{
  "mastery_update": {
    "topic": "SQL JOIN",
    "mastery": 0.42
  },
  "observations": [
    "Confunde INNER JOIN con LEFT JOIN",
    "Resuelve mejor con ejemplos visuales"
  ],
  "recommended_next_topics": [
    "Foreign Keys"
  ]
}
```

El backend:

1. recibe la observación;
2. la valida;
3. aplica reglas;
4. persiste el resultado.

Así se evita que una alucinación del modelo modifique incorrectamente el perfil del estudiante.

---

# 42. Organización del proyecto

La recomendación final fue dividirlo en cinco repositorios independientes:

```text
1. learning-core
```

FastAPI con toda la lógica de negocio.

```text
2. learning-mcp
```

Servidor MCP que expone herramientas y consume `learning-core`.

```text
3. learning-ingestion
```

Pipeline para importar:

- PDFs
- DOCX
- PPTX

y generar:

- chunks
- embeddings
- índices

```text
4. learning-web
```

Aplicación web, por ejemplo con Next.js.

```text
5. course-packs
```

Repositorio con:

- cursos;
- roadmaps;
- prompts;
- rúbricas;
- configuraciones;
- metadata de materias.

---

# 43. Visión final del sistema

La arquitectura conceptual completa quedó así:

```text
                         ┌───────────────────┐
                         │      USUARIO      │
                         └─────────┬─────────┘
                                   │
              ┌────────────────────┼────────────────────┐
              │                    │                    │
              ▼                    ▼                    ▼
        Claude Code           ChatGPT             Web App
              │                    │                    │
              └────────────────────┼────────────────────┘
                                   │
                                   ▼
                            Learning MCP
                                   │
                                   ▼
                            Learning API
                                   │
              ┌────────────────────┼────────────────────┐
              │                    │                    │
              ▼                    ▼                    ▼
       Knowledge Service     Student Service      Pedagogy Service
              │                    │                    │
              └────────────────────┼────────────────────┘
                                   │
                    ┌──────────────┼──────────────┐
                    │              │              │
                    ▼              ▼              ▼
              PostgreSQL       pgvector      Object Storage
                    │              │              │
                    │              │              │
                    ▼              ▼              ▼
               Progreso        RAG/Data       PDFs/PPT/DOCX
               sesiones        embeddings      materiales
               intentos
```

Y por encima de todo esto estaría el modelo de IA elegido por el usuario.

```text
Claude
GPT
Gemini
Ollama
Modelo propio
etc.
```

El modelo no sería el producto.

**El producto sería el sistema de aprendizaje.**

---

# 44. Principio central del proyecto

La idea se puede resumir así:

> **Construir una infraestructura de aprendizaje que permita convertir distintos LLMs en tutores personalizados, utilizando conocimiento de la cátedra, recursos externos controlados, memoria del estudiante, herramientas específicas de cada materia y un motor pedagógico que determine qué enseñar, cómo enseñarlo y qué hacer a continuación.**

La arquitectura debería ser independiente del proveedor de IA.

El LLM es reemplazable.

El conocimiento, la memoria, la pedagogía, el progreso y las herramientas pertenecen al sistema.

---

# 45. Próximo paso lógico

Antes de escribir cientos de líneas de código, el siguiente paso debería ser diseñar el **MVP mínimo**.

Una primera versión podría limitarse a:

```text
1 materia
   ↓
Material de la cátedra
   ↓
RAG
   ↓
Perfil de estudiante
   ↓
Tutor
   ↓
Ejercicios
   ↓
Corrección
   ↓
Memoria del progreso
   ↓
MCP
   ↓
Claude Code
```

Una vez que ese circuito funcione de punta a punta, se pueden agregar:

- múltiples materias;
- grafo de conocimiento;
- diferentes herramientas;
- aplicación web;
- planificación;
- evaluaciones;
- adaptación pedagógica;
- otros modelos;
- otros clientes.

La recomendación es **no empezar construyendo todo el sistema descrito arriba**. Primero habría que demostrar que un único estudiante puede tener una sesión de aprendizaje completa, que el sistema recuerde lo ocurrido y que en la siguiente sesión realmente tome mejores decisiones gracias a esa memoria.
