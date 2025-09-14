
 
<!-- Explicit requirements copied from specs, JSON, or documentation for the json folder. --
> 
<!-- End JSON REQUIREMENTS COPIED -->  
### DERIVED  
<!-- Begin JSON REQUIREMENTS DERIVED --> 
# JSON REQUIREMENTS DERIVED  
<!-- Requirements reverse-engineered or inferred from the code in the json folder. -->  
## style_rubric.json & config_doug_rubric.json - All code should use inline comments, object-oriented structure, and required 
documentation. - Naming conventions should follow snake_case. - Recursion and pattern use are allowed and encouraged. - Modularity should be high, and example usage should be included. - Preferred languages are Python and JavaScript.  
## aniota_patent_requirements.json & REQ_aniota_patent_requirements.json - The system should observe, encode, and record user behavior as structured event slices 
with timestamps. - Pattern recognition, hypothesis logging, and intervention generation should be supported. - Only successful patterns should be stored long-term, with privacy and agency protected 
at all times. - Feedback should be symbolic, non-punitive, and emotionally safe. 
- The system should operate locally unless data is explicitly exported by the user. - Learning moments, mastery chains, and symbolic alignment across subjects should be 
visualized and tracked.  
## common_actions.json - The system should support multi-step user task templates for calibration and pattern 
matching. - User actions should be recorded and refined as real data becomes available.  
## config_* and project_config.json - Each project should define its name, author, version, purpose (who/what/why), 
input/output types, core logic, modules, dependencies, and language. - Access control and permissions should be configurable by role. - Comments and tests should be required or configurable per project.  
## phonemix_template.json - Project scaffolding should be generated from templates, including HTML, CSS, and 
JavaScript content as needed. - All logic and UI for simple prototypes can be included in a single file for rapid prototyping.  
## shape_function_limits.json - The system should enforce limits on shape and function operations (e.g., setPosition, 
setLabel, setType, attachData) as defined in the config.  
## manifest.chrome-extension.json & manifest.web-app.json - The extension and web app should define metadata, permissions, icons, and startup 
behavior for deployment. 
- Accessibility, modularity, and user privacy should be considered in manifest and 
configuration design. 
<!-- End JSON REQUIREMENTS DERIVED -->  ---  
## STYLES REQUIREMENTS  
### COPIED  
<!-- Begin STYLES REQUIREMENTS COPIED --> 
# STYLES REQUIREMENTS COPIED  
<!-- Explicit requirements copied from specs, JSON, or documentation for the styles folder. 
-->  - Use DK Softworks brand colors: mid-gray background, white on black graphics, EKG green 
accent. - Provide an animated EKG heartbeat header (800ms cycle, white and green lines on black). - Use a modern, clean, high-contrast design with rounded corners and large click/touch 
targets. - Support dark/light backgrounds and gradients for main UI areas. - Ensure all buttons and controls have clear hover/focus/active states. - Use scalable, accessible font sizes and spacing for readability. - Provide a responsive layout for desktop and mobile. - Include a shape palette, snap grid, and draggable UI elements styled for clarity and 
usability. 
- Use icons and color cues for status, actions, and feedback. - Support accessibility: focus indicators, high-contrast mode, and ARIA-friendly styles. - All style variables and colors should be defined in :root for easy theming. - Provide visual feedback for drag-and-drop, selection, and error states. - Use box shadows and subtle gradients for depth and separation. - Style all major UI sections: hero, buttons, panels, modals, palette, snap points, etc. - Ensure all styles are modular and reusable across components. - Use Noto Sans Rounded as the official default font for the project (for all UI and text), with 
other Noto family fonts allowed for emphasis or special cases.  
## Aniota BiometrIX Colors (from color_picker.html) - Cactus Green: #2E8B57 - Sandstone Red: #C1440E - Yellow Sand: #FFD700 - Olive: olive - Dim Gray: dimgray - Royal Blue: royalblue - Light Blue: lightblue - Navy: navy - Pale Green: palegreen - Dark Green: darkgreen - Gainsboro: gainsboro - Alice Blue: aliceblue - Light Yellow: lightyellow - Accent (various): rgba(154,205,50,0.7), rgba(112,128,144,0.7), rgba(135,206,235,0.7), 
rgba(0,191,255,0.7), rgba(34,139,34,0.7), #C2B280, etc.  
- These colors are used for biome/biometric UI elements and are referenced in the Aniota 
color picker for backgrounds, text, and accents.  
<!-- End STYLES REQUIREMENTS COPIED -->  
### DERIVED  
<!-- Begin STYLES REQUIREMENTS DERIVED --> 
# STYLES REQUIREMENTS DERIVED  
<!-- Requirements reverse-engineered or inferred from the code in the styles folder. -->  - The design system should allow for easy theme switching and future branding updates by 
centralizing color variables. - All interactive elements (buttons, shapes, palette items) should provide immediate visual 
feedback for user actions. - The EKG heartbeat animation should be modular and reusable for other branding or 
feedback purposes. - Layouts should adapt fluidly to different screen sizes and orientations. - The style system should support adding new UI modules (e.g., new panels, sections, or 
controls) without major refactoring. - Accessibility features (focus, contrast, ARIA) should be extensible for future compliance 
needs. - All style rules should be organized and commented for maintainability and onboarding. - The CSS should minimize specificity conflicts and support component-based 
development. - Animations and transitions should be performant and not interfere with accessibility or 
usability. 
- The style guide should be referenced for all new UI work to ensure consistency. 
<!-- End STYLES REQUIREMENTS DERIVED -->  ---  
## DOC REQUIREMENTS  
### COPIED  
<!-- Begin DOC REQUIREMENTS COPIED --> 
# DOC REQUIREMENTS COPIED  
<!-- Explicit requirements copied from specs, project documentation, and requirements 
markdown files in the docs folder. -->  
## System Architecture & Extensibility - The system shall implement a modular architecture with distinct functional cortices 
(perception, inference, temporal, atemporal, communication), each as a separate, testable 
module. (DOC_architecture_extensibility.md, REQUIREMENTS.md) - The architectural metaphor must be documented and applied consistently throughout 
the development cycle. (DOC_architecture_extensibility.md)  
## User Interaction Logging - The system shall monitor and log all user interactions, including mouse movements, 
keyboard usage, clipboard events, and tab-switching, in real time. 
(DOC_log_requirement_6.md) - The system shall encode user events into structured memory slices, with timestamps and 
event type metadata. (DOC_log_requirement_7.md) 
- The system shall process behavioral data in 9-second analysis blocks and support micro-
level (1-second) event detection. (DOC_log_requirement_8.md, DOC_log_requirements_6-
9.md) - The system shall allow users to opt in or out of behavioral monitoring at any time, with a 
clear visual indicator of monitoring status. (DOC_log_requirements_6-9.md)  
## Temporal Data Management - Aniota shall manage a configurable "fade" window for user interaction events. Once an 
event's significance has faded, it is no longer considered part of the present context and is 
discarded from active memory, rather than being retained as historical data. This replaces 
the fixed 10-minute rolling window approach and ensures only relevant, recent events 
influence system behavior. - Only Learning Moments are ever recorded. A Learning Moment is a start-to-finish pattern 
capture, spanning from the beginning of a conversation to the point where mastery is 
confirmed. Learning Moments are strictly session-bound: if the user closes Aniota (such as 
by closing the browser), any information from the last Learning Moment is lost. No data is 
retained across sessions; nothing is kept once the session ends.  
## Learning Moments & Data Retention - Only Learning Moments are ever recorded by the system. No other user data, events, or 
patterns are retained outside of these Learning Moments. - A Learning Moment is defined as a start-to-finish pattern capture, beginning at the origin 
of a conversation or task and ending at the point where mastery is confirmed. - Learning Moments are strictly session-bound: if the user closes Aniota (e.g., by closing 
the browser or ending the session), any information from the last Learning Moment is lost 
and not retained in any form. - No historical data, partial patterns, or user events are preserved beyond the active 
session or outside of confirmed Learning Moments. - This approach ensures maximum privacy and aligns with the project's compliance and 
ethical mandates.  
## Project Philosophy & Process - All existing artifacts (modules, logs, documentation) must be preserved between 
orchestration cycles. (REQUIREMENTS.md) - Prior work, devlogs, and build/package logs must be leveraged before processing each 
requirement. (REQUIREMENTS.md) - Each requirement must be validated, logged, and documented as part of the 
orchestration process. (REQUIREMENTS.md) - Continuous improvement and auditability are required at every cycle. 
(REQUIREMENTS.md)  
## QuickStart & Usage - Project scaffolding and documentation must be generated using the provided templates 
and scripts. (DOC_phonemix_quickstart.md) - The who, what, and why of each project must be clearly documented. 
(DOC_phonemix_who_what_why.md)  
## SSAIHC Framework - AI-to-human communication must follow the SSAIHC symbolic template system for 
clarity and structure. (DOC_SSAIHC_framework.md)  
## Summary & Objectives - The project must demonstrate recursive learning transformation through ethical 
behavioral observation and intervention. (DOC_devplan_aniota.md) - Success criteria include: core components implemented, behavioral pattern recognition 
accuracy >90%, intervention acceptance rate >60%, zero privacy violations, measurable 
learning improvement, and patent application readiness. (DOC_devplan_aniota.md) 
<!-- End DOC REQUIREMENTS COPIED -->  
### DERIVED 
 
<!-- Begin DOC REQUIREMENTS DERIVED --> 
# DOC REQUIREMENTS DERIVED  
<!-- Requirements reverse-engineered or inferred from the documentation files in the docs 
folder. -->  
## architecture.md - The modular design implies that new modules, sensors, or analysis engines can be added 
without refactoring existing core modules, as long as interfaces are respected. - The system should support extension by simply adding new Python files and registering 
them in configuration, minimizing the need for changes to existing code.  
## assets_placement.md - All non-code assets must be placed in their correct paths for the system to function as 
intended, even if not explicitly required by the code. - Asset organization and placement are essential for reproducibility and maintainability.  
## devplan.md - The project should be developed in phases, with clear objectives and measurable 
success criteria for each phase. - Development should include iterative improvement, with regular assessment of progress 
against objectives. - The system should be designed to allow for future patent application and compliance 
with ethical standards, even if not stated as a hard requirement.  
## README.md 
- Calibration routines and common user actions should be updated as real user data 
becomes available, to improve system accuracy. - The system should provide mechanisms for recording, refining, and calibrating behavioral 
patterns over time. - Calibration points and routines should be used to ensure consistent measurement and 
comparison across devices and environments. 