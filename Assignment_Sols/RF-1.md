# Feasibility Report

Audrey Dickson, Kaden Langford, Andrew Swartz  
Indiana University Southeast  
CSCI-P445  
Dr. Ronald Finkbine  
September 19, 2025

## Product

> Product: A general statement of the product; give a brief description of what the proposed system will do, highlighting where the proposed system meets the specified business requirements of the organization.

Our product, Lost Grenadiers, is a webapp GPS tool meant for incoming and established students at Indiana University Southeast. Students can access the tool through a web interface,  which can read their real-time location and direction, and allows routing to different buildings and classrooms with GPS tools.


## Technical Feasibility

> Technical Feasibility: Will the proposed system perform to the required specification? Outline technical systems options you propose to use, which will give a technical solution satisfying the requirements and constraints of the system, as outlined in the terms of reference.

1. Platforms and Technologies
- Web frontend: HTML, CSS, JS
- Backend: Python/Flask
- Database: MySQL
- Mapping/GPS: TODO

2. Hardware and Software Requirements   
- A device with navigation capabilities
- Network connection (ie eduroam)
- Server hosting for the webapp

3. Constraints
- Accuracy entirely reliant on GPS
- Privacy: data must be handled securely
- Need internet connection for tracking


## Social Feasibility

> Social Feasibility: Consideration of whether the proposed system would prove acceptable to the people who would be affected by its introduction. Describe the effect on users from the introduction of the new system; consider whether there will be a need for retraining the workforce. Will there be a need for relocation of some of the workforce? Will some jobs become deskilled? Will the current workforce be able to perform effectively any new tasks introduced by the proposed system? Describe how you propose to ensure user co-operation before changes are introduced.

1. User Acceptability
The proposed system is expected to be well-received by students, as it simplifies traversal on campus. It can be used amongst newer students to help locate classrooms and buildings easily. Most users will already have access to a smartphone, so adoption should be straightforward.

2. Training/Learning Curve
Minimal user training will be required, as the interface is designed to be intuitive and similar to familiar GPS or map applications. A short tutorial may be implemented to ensure that new users can navigate the system effectively.

3. Workforce Impact
Campus staff responsible for maintaining building and classroom information may need to learn how to update system data, but this can be accomplished quickly and easily. This tool should not deskill any jobs on campus.

4. User Cooperation
The simple and friendly UI, clear instructions, and promotion of the system through announcements and orientations ensure user cooperation. Feedback could be accepted to report isseus or suggest improvements, which further increases engagement.


## Economic Feasibility

> Economic Feasibility: Consider the cost/benefits of the proposed system. Detail the costs that will be incurred by the organization adopting the new system; consider development costs and running costs. Detail benefits that the new system will bring, direct economic benefits such as reduced costs, and indirect benefits, such as improved management information and better customer service. Illustrate the cost/benefit of the new system by applying a suitable cost/benefit analysis method such as the payback method.

1. Running Costs
- Server hosting / cloud service costs
- API usage fees (only an issue with LARGE usage)

2. Benefits
- Saves student time navigating campus
- Reduces questions and confusion for staff and administration
- Improves campus experience for students, implying better satisfaction
- Provides management with data about building usage or traffic patterns

3. Cost/Benefit Analysis
- Estimated total costs: TODO
- Value of benefits: TODO
- Payback Period: TODO

## Market Research
> Market Research: A comprehensive market research identifying a need for the product. Detail all market research you carried out, listing sources of information. Justify any conclusions you have drawn from your research. Identify the potential customer base for your product, together with evidence of customer need for the product. Describe how you propose to compete with similar products on the market.

Navigation of a university campus can present significant challenges for students and faculty. This is certainly the case for first-year students and even professors. The lack of a solitude resource for efficient campus navigation would lead to:
- Students arriving late to a class, potentially missing out on important coursework information or causing the professor the need to reiterate course material.
- Professors arriving late to a class, reducing the total time spent teaching the subject to the students and potentially lessening the average grade of the students.

Poll Results of University Students
We conducted a small scall poll among university students using the social media platform Instagram. Key findings include:
1.	Campus familiarity: 29% of students reported they would struggle in finding a classroom given the room name only, and 6% reported they would not be able to find the room given the room name only.
2.	Building distribution: 29% of students attend classes spread across multiple buildings in a given semester.
3.	Map usage: 59% of students reported the heavy usage of maps during their freshman year, and another 18% confirmed that they continue to use maps at the beginning of each semester or the first few days of attending a class.
4.	Professor punctuality: 84% of students reported at least one professor has been late to class.
5.	Hopelessness handling: In the event of being lost, 38% of students claimed they would struggle in silence. Only 12% of students reported they would not be afraid to ask professors/staff for help in navigation and only 15% of students reported they would not be afraid to ask students/people their age for help in navigation.

The above results of the poll reveal vital information pertaining to our project.
1.	The majority of freshman-year students could be overwhelmed and do not know how to navigate campus. This implicitly states that a large portion of our userbase will be first-year university students, and it confirms our product has a need.
2.	Almost 1/3 of students have classes within multiple buildings, meaning their campus navigation is more complicated than that of other students. They would have to develop familiarity with each of the buildings as opposed to just one of them. This leads to a direct need for our product.
3.	Over 1/3 of the students agreed that they would struggle with navigation in silence-meaning they do not feel comfortable or confident enough to request assistance from others. These students would benefit from our product because communication with other students or staff is not required through our product.



## Alternative Solution

> Alternative Solution: Consideration of alternative solutions should be documented. At least two alternative business or technical systems options should be considered. Detail the differences between these options and the proposed system. Justify your choice of the proposed system and the reasons for rejecting the alternative options.

Physical maps: One option of retrieving the same information that our application would provide is through the use of physical maps. There are multiple maps picturing an overhead view of our campus with each of the buildings labelled accordingly. Students are given a room name, which has a standard naming convention (e.g., LF110 = Life Sciences Building, First Floor, Room 10), and need to find the physical room with the limited information.
For on-campus courses, students navigate campus by the following procedure:
1. Retrieve room name from course syllabus on Canvas.
2. Review a map of campus and find the associated building.
3. Walk into the associated building and use stairs if necessary.
4. Walk down hall of respective floor until the room number is found.

Campus map website: A second option of retrieving similar information is through a currently existing website found at Campus Map and Directions. This website has a published assortment of overhead campus photographs, and it even includes other Indiana University campuses. The difference between our product and this product is that there is no indoor mapping feature found on their website. Users can only hover over a building and identify its name, as well as some other information such as the date built. This is not nearly as helpful to students because it does not show the direct shortest path from their location to a classroom, or any indoor mapping functionality at all. Their web portal poses a lot of potential, especially if there were indoor maps included on it.

## Project Risks
> Project Risks: To have success in managing a software project, the project manager needs to understand the nature of software risks, which can be defined as uncertain events or conditions that, if they occurs, can have a negative effect on a project outcome. List and discuss some the risks associated with this project.]

There are multiple risks that affect the usefulness and functionality of our product.
1. Campus construction: If a portion of our campus were to shut down for construction or maintenance work, our product would need to immediately reflect these changes. If our product did not immediately reflect these changes, it could potentially lead people directly through construction zones, posing a safety hazard. Similarly, our product could lead users to a dead-end if an entrance to the building is closed off.
2. Data accuracy: The map database would need to be maintained by staff consistently. If the name of a room is modified or if a renovation occurs which alters the layout of a building, the respective changes will need to be modified in our database to ensure the accuracy and efficiency of our product.
3. Website security risk: Any active website poses a potential security threat. Adequate cyber security analysts would need to confirm our product does not risk the exposure of any private data of students, including their location or classroom locations.

Each of these pose an active threat and concern for our product and will be thoroughly taken into consideration during the development of our product. This denotes our product requires the need for easily updating our database of the campus map so we can modify our path finding algorithm to adjust to any modifications to the campus. 
