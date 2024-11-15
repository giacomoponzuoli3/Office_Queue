TEMPLATE FOR RETROSPECTIVE (Team ##)
=====================================

The retrospective should include _at least_ the following
sections:

- [process measures](#process-measures)
- [quality measures](#quality-measures)
- [general assessment](#assessment)

## PROCESS MEASURES 

### Macro statistics

- Number of stories committed vs. done
> The number of stories committed is 5.
 The number of stories completed is 3.
- Total points committed vs. done 
> The number of points committed is 3 (Get Ticket) + 5 (Next Customer) + 2 (Call Customer) + 3 (Config Counters) + 2 (Get Estimated Time) = 15
  The number of points done is 8 
- Nr of hours planned vs. spent (as a team)

**Remember** a story is done ONLY if it fits the Definition of Done:
 
- Unit Tests passing
- Code review completed
- Code present on VCS
- End-to-End tests performed

> Please refine your DoD if required (you cannot remove items!) 

### Detailed statistics

| Story  | # Tasks | Points | Hours est. | Hours actual |
|--------|---------|--------|------------|--------------|
| _#0_   |  5       |       |   29h 30m     |   30h           |
| Get Ticket      |      7   |        |    17h     |   22h 30m   |
|  Config Counters     |    11     |        |     24h 40m       |       26h 15m       |
| Next Customeer      |  6       |        |       17h 30m     |      14h 30m        |
| Call Customer    |     4    |        |     11h       |    4h          |
| Get Estimated Time       |    6     |        |    15h 30m        |  17h 30m            |
   

> story `#0` is for technical tasks, leave out story points (not applicable in this case)

- Hours per task average, standard deviation (estimate and actual)
- Total estimation error ratio: sum of total hours spent / sum of total hours effort - 1

    $$\frac{\sum_i spent_{task_i}}{\sum_i estimation_{task_i}} - 1 = \frac{114}{115} -1 = -0.00869565 $$
    
- Absolute relative task estimation error: sum( abs( spent-task-i / estimation-task-i - 1))/n

    $$\frac{1}{n}\sum_i^n \left| \frac{spent_{task_i}}{estimation_{task_i}}-1 \right| = \frac{1}{6}(1.0169 + 1.3235 + 1.0714 + 0.8285 + 0.3626 + 1.1437) = 0.9577 $$
  
## QUALITY MEASURES 

- Unit Testing:
  - Total hours estimated: **20h 30m**
  - Total hours spent: **15h**
  - Nr of automated unit test cases: **186 unit tests** 
  - Coverage (if available)
- E2E testing:
  - Total hours estimated: **7h**
  - Total hours spent: **5h 30m**
- Code review 
  - Total hours estimated: **3h**
  - Total hours spent: **3h**
  


## ASSESSMENT

**What caused your errors in estimation (if any)?**

Here are the main causes that led to errors in our estimations:
  1. **Underestimating the time required for testing**: We didn’t allocate enough time for comprehensive testing, including regression and integration tests, which ended up taking more time than expected

  2. **Not accounting for potential bugs or unforeseen risks**: We didn’t plan for a buffer to handle unexpected bugs or technical issues that arose during development, which delayed task completion
  
  3. **Underestimating the time needed for code reviews and code testing by team members**

**What lessons did you learn (both positive and negative) in this sprint?**
 
 ***Positive Lessons***:
1. **Improvement in our ability to work within the team**: We have noticed significant progress in our collaboration and communication, which has led to better results

2. **Increased efficiency in time management**: By utilizing the time spent entry within the Agile Board, we have been able to better organize our tasks and meet deadlines

3. **Enhanced ability to adapt to each other's code**: We have developed a greater competency in understanding and adapting the code written by team members, facilitating collaborative work 

  ***Negative Lessons***:

1. **Underestimating the time required for tasks**: We realized that our estimates did not adequately consider the time needed to complete tasks, leading to delays

2. **Too much focus on speed over quality**: In some cases, we prioritized the speed of task completion, sacrificing code quality and necessitating subsequent corrections.

**Which improvement goals set in the previous retrospective were you able to achieve?** 

1. **Completion of User Stories**: Despite facing some implementation challenges, we were able to complete all the user stories we committed to in the sprint even if some are not tested by unit tests

2. **Enhanced Collaboration**: We focused on improving our communication within the team, which helped us troubleshoot problems more effectively and work together to find solutions

**Which ones you were not able to achieve? Why?**
In the previous retrospective, we identified several improvement goals, and unfortunately, there were a few that we were unable to achieve:

1. **Delivering a fully functional demo to stakeholders**: We were not able to provide stakeholders with a demo that worked flawlessly. There were some technical issues and unforeseen bugs that arose during the final development phase, which affected the quality of the demo and prevented us from showcasing the product at its best

2. **Time management**: While we completed the user stories, we did not fully adhere to the timelines we set for preparing the demo. This was partly due to the need to address implementation and testing issues that emerged at the last minute



**Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.)**

Looking ahead to the next sprint we should improve our team coordination and try to orginize our work better. 
To achieve this goal we need to implement and testing the user stories in priority order, after a user story is done we shouldn't modify it
to avoid possible errors in later project implementations.

**One thing you are proud of as a Team!!**

As a team everyone help each other when someone has a problem or some difficulties.