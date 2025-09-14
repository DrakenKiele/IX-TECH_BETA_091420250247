# Data Evaluation & Question Generation Requirements

1. **Universal Text Input**
	- All incoming data (from manual, AI, or subscribed sources) is processed as text.

2. **Semantic Parsing**
	- The system parses text to identify subject-predicate relationships and statements of fact.

3. **Keyword & Standards Mapping**
	- The system attempts to connect parsed statements to relevant standards (e.g., IC3, CSTA) using keyword matching and semantic similarity.

4. **Gatekeeping Logic**
	- A file passes the “first gate” if it enables the generation of a variety of subject-predicate sentences mapped to standards.
	- Files that only contain links, navigation, or lack substantive content do not pass.

5. **Autonomous Value Assessment**
	- The system autonomously determines the instructional value of each file based on its ability to generate meaningful, standard-aligned questions.

6. **No Data Conversion Needed for AI/Subscribed Sources**
	- AI-generated and subscribed datasets are assumed to be natively compatible; conversion logic is only for manual or legacy sources.

7. **Scalability & Modularity**
	- The system is designed to easily integrate new standards, data sources, and parsing strategies.
