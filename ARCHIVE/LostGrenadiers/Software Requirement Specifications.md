Lost Grenadiers

FA24-SE-CSCI-P445-19323

Design Capstone

Xiao Wang, Matthew Higdon, Chris Holley

**Breakdown of Individual Contributions:**

**Matthew Higdon:** Helped brainstorm to form the idea of what our project would be. Provided a usable framework in the form of a past project, worked on project reports and attended meetings with team members. Discussed framework and languages. Scheduled meetings with other team members. Completed Alternative solution and Project risk on the feasibility report. Completed System, User, Hardware, and Software Interface on the SRS, along with memory constraints, Availability, and External Interface Requirements

**Xiao Wang:** Team Leader. Established Git repository and invited the team. Delegated tasks and set up initial sprint issues to be resolved. Scheduled meetings with other team members. Recorded meeting minutes and discussed timelines for group inputs/tasks. Completed the Product and Technical Feasibility sections on the feasibility report. Completed requirements, compliances, and formatting over the documentation. Also starting to upload data files into GitHub repository and oversee the development cycle of the project.

**Chris Holley:** Closed some GitHub Issues assigned by team leader, commented/provided input on several others. Communicated with points of contact to get interior maps and building layouts. Found several interior maps usable for our project. Helped with inputs on framework choices and language choice/migration. Scheduled meetings with other team members. Social Feasibility, Economic Feasibility, Market Research sections on the feasibility report. Constraints, Assumptions, Dependencies, User Characteristics, Site Adaptation Requirements, System Overview, Operations, Definitions, References, Product Functions, security, and portability on the software requirements specification.

**Software Requirements Specification**

**Introduction:**

**Definitions**: API: Application Programming Interface. IUS: Indiana University Southeast. TCP/IP: Transport Control Protocol/Internet Protocol. One.IU: The centralized database for Indiana University.

**System Overview**: A more robust map program that helps the end user to find certain classrooms, offices, amenities at the campus of Indiana University Southeast.

**References**: <https://en.wikipedia.org/wiki/Software_requirements_specification>

**Overall Product Description:**

**Product Perspective:**

**System Interfaces:** For the system interface, we would like to incorporate our program into One.IU. This would allow it to communicate with the database directly to find in which room a certain class is being taught. If a student is signed in, the program would be able to find what classes the student is enrolled in and automatically populate the map with the locations of their classes.

**User Interfaces:** The user interface would involve a map of the interior of Life Sciences, (if time permits, we intend on expanding the map to cover the entire campus). This map would have blips on it on the rooms for the classes the student is enrolled in. Restrooms and other amenities would also have blips over them. If we are not able to access the One.IU server, we intend to incorporate an interface that allows a student to fill in which classes they are enrolled in, and a teacher interface that allows them to fill in what rooms their classes are being held in.

**Hardware Interfaces:** mobile devices, pcs and macs and the One.IU servers if possible.

**Software Interfaces:** The program will interact with smartphone integrated software and the One.IU server if possible.

**Communication Interfaces:** Devices will communicate via internet, TCP/IP and/or the One.IU server if possible

**Memory constraints:** based on current map applications and current smartphone memory, we do not believe memory will act as a constraint in this program. Most map applications use around 2–5 MB of data per hour.

**Design Constraints**

**Operations**: Some functionalities may not be utilized and/or implemented without One.IU access. Some functionality might exceed the scale of the project. Scalability will not be an issue once the initial building is completed.

**Site Adaptation Requirements**: No adaptations will be required for the proposed site, as the initial product that is being modified was already a functional mapping system for the exterior of the IUS campus. Adaptations will also not be necessary when the system is scaled, as the interfaces will be scalable with no change to existing functionality.

**Product Functions**: The product will first be an interactive map of the Life Sciences building. Once this functions and stands as proof of concept, we will scale it to other buildings and, if time and scope allow, the existing exterior map, dependent upon One.IU access.

**User Characteristics**: College Student and/or Professor. The student is the intended user and will be knowledgeable enough to use the UI. The Professors, if access is needed for class assignment, will have access to additional UI elements, but will have a reasonable expectation of being able to operate (The UI is much easier and more streamlined than Canvas for example.). Both groups are usually technically savvy and educated and have an interest in practical applications to aid in efficiency and autonomy.

**Constraints, Assumptions, Dependencies**: Heavy constraint to the widespread acceptance of our design would be market knowledge/advertising. Since this is an in-house project, Indiana University Southeast would not have incentive, monetarily or otherwise, to advertise this new product/capability. The assumptions made in the design are that most students will have a cellular device, as a large portion of the practicality and use-case involves being mobile with the map application up and running. Dependencies include access to IU servers if we can secure permission to utilize existing student/teacher databases and downloading of the API for individual usage/teachers using the teaching side of the API if this is not feasible.

**Specific Requirements:**

**External Interface Requirements:** One IU Access if we integrate the project with the server. Otherwise, standard API.

**Functional Requirements:** Be able to search and locate buildings, amenities, and location on the IUS campus by the user.

**Performance Requirements:** The performance must be streamlined and fast to be able to search the database efficiently and display the information neatly on the API.

**Design Constraints:** The IU One server won’t give us access and probably a dead end.

**Standard Compliance:** Should be accurately mapped, the data should be up to date and be able to change the data on a whim.

**Logical Database Requirements:** We are trying to incorporate the IU One server, but it is unlikely due to access restriction, so we are seeking a roundabout way such as a separate teacher & student database to allow for more access to changes.

**Software System Attributes:** Python as the programming language and map-friendly framework.

**Reliability:** Must be readily accessible to all users whether through local or over the Internet.

**Availability:** Available to all IUS students, faculty and staff. Also, any potential visitors that visit the campus without prior knowledge of the campus.

**Security:** Changes with scope and scalability. If One.IU access is brought into scope, security will become paramount. As a standalone API, this becomes a much smaller concern. Base cases will need to be at a minimum: Authentication, access control, secure communication protocol.

**Maintainability:** Should be updated semesterly or whenever a change is necessary. We are trying to allow access from IUS to allow continuous flow of data, but it is not likely due to access privileges.

**Portability:** Exceedingly High. The product is designed for cellular devices. Also, any standard devices but the project is geared toward fast mobile devices since it is an assist tool.

**Other Requirements:** TBD