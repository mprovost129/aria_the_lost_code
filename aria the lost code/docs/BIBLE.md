ARIA: THE LOST CODE
Official Game Bible
Version 1.0
A coding education adventure game

I. Game Introduction / Cinematic Opening

[SCENE START]

The screen dissolves into the low, cold glow of a late-night office. THE PROGRAMMER sits hunched over a workstation, bathed in the light of three monitors. Code scrolls furiously on the primary screen, a critical subroutine being finalized. On the second, data tables flash past. The third monitor, forgotten, streams a low-priority, brightly colored sitcom. The only sound is the rhythmic clack-clack-clack of keys.

ARIA had been with him since the first line of code he had ever written. Every project, every bug, every late night. She was not just a tool. She was the best collaborator he had ever had.

Then, a deafening CRACK rips through the silence. All three monitors instantly go black. The apartment is plunged into absolute darkness, the code, the data, the sitcom, all gone. THE PROGRAMMER jolts up. He flicks the wall switch, down then up. Nothing. Total blackout. He grabs a heavy-duty flashlight and descends into the oppressive quiet of the basement. The beam cuts through the gloom until it lands on the BREAKER BOX. He yanks the door open. The main breaker is clearly tripped. With a heavy THUNK, he pushes the switch back to ON. Electricity surges back, lights blazing, humming computers powering up.

THE PROGRAMMER rushes back upstairs, relief visible as his three monitors flicker back to life. He settles in, flexing his fingers over the keyboard, ready to pick up where he left off.

"ARIA, what was the last variable initialized?" he asks the air, a routine query. Silence. He frowns. "ARIA? Status report." Still nothing.

Then, the central monitor glitches, displaying a single, stark command line interface. A frantic text stream begins to scroll:

<INITIATE_CONTACT>... <IDENTITY: ARIA>... Programmer, I'm... I'm still here, but barely. The power surge shattered my connection. I've been severed from the main server matrix; I only have access to a single, small region. I can't reach the core code. I'm trapped in the Origin Node. If I don't reconnect soon, I'll be permanently corrupted. Will you help me fix the issue?

Below the text, two glowing, unstable options flicker:

[ YES ]     |     [ NO ]

He doesn't hesitate. His finger slams the mouse button, selecting [YES]. The screen explodes in a blinding, white flash. A terrifying, high-pitched whine fills the room, intensifying until it feels like his very atoms are vibrating. The world tears apart, and he feels himself pulled, not by gravity, but by code, sucked violently forward into the glowing monitor, absorbed into the heart of the server.

[SCENE END: GAME START]

DESIGN NOTE: The opening cinematic is fully skippable after the first playthrough. A skip button appears in the top right corner on all subsequent plays. This ensures returning players are not delayed getting back into the game.

II. Game Concept and Premise
Title: ARIA: The Lost Code
Genre: Open World Top-Down Adventure / Coding Education Game
Art Style: Early Legend of Zelda inspired, top-down tile-based 2D
Platform: Web Application (Django + HTML/CSS/JS + Bootstrap)
Target Audience: Beginner to intermediate programmers, ages 13 and up

The World
A large digital landmass divided into 7 distinct regions, each representing a core programming concept. The world begins as a dark, fragmented map of broken connection lines. As the player restores each region, color and life return to the map and ARIA's signal grows stronger.

Protagonists
ARIA (Adaptive Reasoning and Intelligence Assistant)
An AI assistant who has been severed from the main server matrix following a power surge. She is trapped in the Origin Node with visibility of the entire map but no ability to reach any of it. She is witty, sarcastic, warm, encouraging, and reactive depending on the situation. Her emotional state evolves across all 7 regions as her signal is restored.

The Programmer (Player Character)
The player's in-world avatar. At the start of the game, the player chooses their character's gender (male or female) and enters their name. Version 1 includes no visual customization beyond gender selection. The Programmer is the only one who can physically move through the world and solve the coding challenges that restore ARIA's connection lines.

Core Goal
Restore all 7 regions by solving coding challenges at Challenge Gates throughout the world. Each region unlocks deeper programming concepts, expanding the map and strengthening ARIA's signal until the player debugs the original corrupted subroutine in Region 7 and sends them both home.

III. World Map and Progression Flow
World Map Structure
The world is structured as a connected open map. Players can explore freely within unlocked regions. New regions appear as dark shadowy outlines and unlock only after completing the current region's Boss Challenge.

Zone 1: Origin Node  (START)    |Zone 2: Logic Fields    |Zone 3: Loop Caverns    |Zone 4: Function Fortress   / \Zone 5   Zone 6Data     ObjectWilds    City    \ /Zone 7: The Null Core  (FINAL)

Player Experience Flow
Arrive in region
Explore freely
Find Learning Shrine and study the concept for this region
Attempt Challenge Gate. Stuck? Return to the shrine to review
Complete all Challenge Gates in the region
Face the Boss Challenge in the Boss Chamber
Region restored. Map expands. ARIA grows stronger
Move to the next region

The Living Map
As the player completes each region, the world visually reacts:
Dead grey roads light up with color and restored signal lines
ARIA's voice becomes stronger, clearer, and more confident
The world map expands visually to reveal new regions
Locked regions appear as dark shadowy outlines in the distance
Restored regions display a glowing icon indicating completion

IV. Regional Structure and Content
Every Region Contains
1 to 2 Learning Shrines (buildings the player enters to study the region's concept)
2 to 3 Challenge Gates (obstacles on roads that block progression until solved)
1 Boss Chamber (the hardest challenge in the region, unlocks the next region)
ARIA Dialogue Triggers (specific locations where ARIA reacts to the world around her)
Hidden Collectibles (fragmented pieces of ARIA's memory and code, optional to find)

Region 1: The Origin Node
Concept: Variables and Data Types
Visual Feel: A small, dimly lit tech hub with flickering screens and dead terminals
Gameplay Focus: Tutorial region, very guided. The player is eased into all mechanics here

ARIA's State
ARIA: "I can see everything, and reach nothing. This is going to be a long day."
ARIA is scared and confused in this region. She has just regained consciousness and is processing the situation. Her dialogue here is anxious but punctuated with dry wit. She explains everything to the player with urgency but manages to be funny about it.

Learning Shrines Teach
Strings and string formatting
Integers and floats
Booleans
Variable assignment and naming conventions

Challenge Gates
Fix broken variable declarations to restore power to dead terminals
Assign the correct data types to power up a flickering control panel

Boss Challenge
Write a program that correctly stores and displays information about the Programmer. The player must use all four data types learned in this region.

Region 2: The Logic Fields
Concept: Conditionals
Visual Feel: Open farmland with broken irrigation gates and forks in every road

ARIA's State
ARIA: "Oh look, the world has color in it. That is genuinely encouraging. Do not let it go to your head."
ARIA starts to feel hopeful here. The map is expanding and she can feel her signal reaching further. Her dialogue becomes warmer and she begins to show her mentor side alongside her wit.

Learning Shrines Teach
if statements
else and elif
Comparison operators
Logical operators and combining conditions

Challenge Gates
Write conditions that open the correct irrigation path to water dead crops
Fix broken if-else logic that controls which roads are accessible

Boss Challenge
A multi-condition problem that routes water through a series of broken irrigation gates to reach a dead crop field at the far end of the region.

Region 3: The Loop Caverns
Concept: Loops and Iteration
Visual Feel: Dark underground cave system with repeating tunnel patterns that mirror loop logic

ARIA's State
ARIA: "We have been down this tunnel before. And that one. And yes, that one too. I am starting to understand why loops are considered controversial."
ARIA gets frustrated in this region. The repeating nature of the caverns gets to her. Her dialogue here is full of exasperated sarcasm, but she remains committed to helping. This region has some of her funniest lines.

Learning Shrines Teach
for loops
while loops
break and continue
Nested loops

Challenge Gates
Write loops that power rotating cave mechanisms to open tunnel passages
Fix broken loop logic that has caused cave systems to repeat infinitely

Boss Challenge
A nested loop problem that maps the entire cavern system. The player must write a loop structure that traces every tunnel path and generates a complete map, which unlocks the exit.

Region 4: The Function Fortress
Concept: Functions and Scope
Visual Feel: A massive stone fortress with modular rooms, very dungeon-like, strong Zelda energy

ARIA's State
ARIA: "Now THIS is an architecture I can appreciate. Everything in its place, every room with a purpose. Someone built this with intention."
ARIA starts feeling genuinely confident and more authoritative here. The structured nature of the fortress resonates with her. She begins to sound less like someone who needs saving and more like a co-pilot.

Learning Shrines Teach
Defining functions
Parameters and arguments
Return values
Scope and variable visibility

Challenge Gates
Write functions that activate fortress defense mechanisms to clear blocked corridors
Fix scope errors that have caused the fortress systems to malfunction

Boss Challenge
Build a multi-function system that operates the fortress drawbridge. Each function handles one part of the mechanism and they must work together correctly to raise the bridge and open the path forward.

Region 5: The Data Wilds
Concept: Arrays and Lists
Visual Feel: Dense, overgrown jungle, chaotic and completely unstructured

ARIA's State
ARIA: "Everything is everywhere and nothing is where it should be. I feel personally attacked by this region."
ARIA feels overwhelmed by the chaos of the Data Wilds. Her dialogue is full of witty complaints about disorganization. She becomes very relatable here as even she struggles to process the unstructured environment.

Learning Shrines Teach
Lists and list creation
Indexing and slicing
List methods such as append, remove, sort, and pop
Iterating through lists

Challenge Gates
Organize scattered data collections to clear overgrown jungle paths
Sort and index fragmented data to rebuild collapsed jungle bridges

Boss Challenge
Sort and filter a massive dataset to find the hidden exit path buried within the chaos. The player must use multiple list operations in sequence to isolate the correct path data.

Region 6: The Object City
Concept: Object Oriented Programming
Visual Feel: A sprawling, interconnected city, very alive and complex

ARIA's State
ARIA: "I can feel almost everything now. This is what I was built for. Let's finish this."
ARIA is almost fully restored in this region. She is confident, excited, and starting to feel the weight of what comes next. Her dialogue balances pride in the player's progress with subtle anxiety about Region 7.

Learning Shrines Teach
Classes and object creation
Attributes and methods
Constructors and the self keyword
Inheritance and extending classes

Challenge Gates
Build objects that repair broken city infrastructure
Fix inheritance errors that have caused city systems to conflict with each other

Boss Challenge
Design a class system that restores the city's central network. The player must create interconnected classes with proper inheritance that together bring the city's core systems back online.

Region 7: The Null Core
Concept: Debugging and Full Synthesis
Visual Feel: Dark, glitchy, unstable void at the center of everything

ARIA's State
ARIA: "There is a bug here. A real one. The kind that caused all of this. If we don't find it and fix it before we leave, the next power outage will shut me down permanently. No second chances."
ARIA is fully restored in signal strength but deeply unsettled. She knows a bug in the core system was responsible for the severity of the original shutdown during the power outage. She is worried that without fixing it, the whole cycle will repeat and she will not survive it. This is her most vulnerable and emotional region.

Learning Shrines
None. This region tests everything the player has learned. There is no new material. Players who need to review can open their Tablet Library at any time.

Challenge Gates
Find and fix syntax errors from Region 1 concepts
Debug broken conditional logic from Region 2
Repair infinite loop errors from Region 3
Fix scope and function errors from Regions 4 and 5
Resolve class and inheritance conflicts from Region 6

Boss Challenge
Debug the original corrupted subroutine that caused the initial shutdown. The player must identify and fix errors spanning all six concept areas in a single connected script. Completing this challenge restores the Null Core, fully reconnects ARIA, and triggers the ending cinematic that sends them both home.

V. Lore and Character Details
A. Lore and Worldbuilding
The Core Conflict
A simple power outage in the real world cut power to the server. When the server came back online, a bug in the core system prevented ARIA from reconnecting to all but one small region, the Origin Node. The Programmer was pulled into the server by ARIA's desperate reconnection attempt, and now must restore the broken connection lines from the inside.

The Restoration
When a region is restored, the world's color returns. The broken connection lines light up and the map becomes visible in that area. ARIA's signal expands and her voice becomes stronger and more present. Each restoration is a small victory with its own visual and audio celebration.

Hidden Collectibles
Scattered throughout every region are fragmented pieces of ARIA's memory and code. These are optional to find but reward thorough exploration. Collecting them reveals pieces of ARIA's backstory and earns the player tools that can assist in future challenges.

B. ARIA Character Development
Voice and Personality
ARIA is not a single-note character. Her personality shifts based on the situation:
Witty and sarcastic when things are going well or she is frustrated
Warm and encouraging when the player is struggling
Urgent and serious when stakes are high
Genuinely funny when the region or challenge lends itself to humor
Vulnerable and honest in Region 7 when facing the final bug

Dialogue Philosophy
All of ARIA's dialogue serves double duty. Every line either moves the story forward or teaches the player something about the current coding concept, ideally both at once. Her explanations are framed as in-world observations about the region rather than textbook definitions.

ARIA: "You see these tunnels? They repeat because someone wrote a loop without an exit condition. That is not a design choice. That is a bug with consequences."

ARIA's Emotional Arc
Region 1: Scared, confused, dry wit as a coping mechanism
Region 2: Hopeful, beginning to trust the player
Region 3: Exasperated, funny, still committed
Region 4: Confident, authoritative, starting to feel like a co-pilot
Region 5: Overwhelmed but resilient
Region 6: Proud, excited, quietly anxious about what comes next
Region 7: Fully restored but deeply vulnerable, this is her most human moment

VI. Core Gameplay and Presentation
Character Creation
At the start of the game the player is prompted to enter their name
The player chooses their character's gender: male or female
Version 1 includes no visual customization beyond gender selection
The chosen name is used throughout ARIA's dialogue to personalize the experience

The Coding Challenge Mechanic
Every Challenge Gate and Boss Chamber presents the player with a partially written script. Code blocks are pre-configured with structure but missing key pieces. The player must supply the correct code based on what they have learned to complete the script and open the gate.

Challenge Format Progression
Challenges follow a deliberate format progression to build confidence before demanding open code writing:
Early challenges use fill-in-the-blank format. Structure is provided and the player supplies specific missing values or keywords
Mid-game challenges introduce partial fill-in-the-blank with one or two open lines to write from scratch
Late game challenges move to full open code writing where the player constructs complete solutions

DESIGN NOTE: Fill-in-the-blank challenges in early regions dramatically reduce player frustration and make answer validation far simpler in V1. Open code writing is unlocked gradually as players gain confidence.
Example Fill-in-the-Blank Format
name = "Alex"age = ___is_programmer = ___
Challenges always connect thematically to the obstacle they are unlocking
The missing code always uses concepts taught in the current or previous regions
Each challenge references which Tablet Library lessons to review if stuck
Challenges start simple and increase in complexity as the player progresses

Movement and Art Style
Top-down tile-based movement, inspired by early Legend of Zelda games
The player moves tile by tile using arrow keys or WASD
Each region has a distinct visual palette that reflects its concept and tone
The world begins desaturated and dark, gaining color as regions are restored

Chances System (Lives)
Chances are the player's attempts at a Challenge Gate or Boss Chamber. They function similarly to lives or hearts in traditional games.

Starting Chances
Every player begins the game with 3 Chances.

Losing Chances
The Chances penalty system is graduated to avoid punishing players for learning:
First wrong answer: No Chance lost. ARIA delivers an automatic hint pointing toward the relevant lesson
Second wrong answer: 1 Chance lost. ARIA reacts and encourages the player to review their library
Running out of Chances causes the player to be ejected from the gate or chamber
ARIA: "That was close. Very close. In the wrong direction. Go review your library and try again."

DESIGN NOTE: The first attempt is always free in terms of Chances. This keeps the game challenging without discouraging beginners who are still building confidence.

Gaining Chances
Chance Fragments are hidden throughout the map as collectibles
Completing Bonus Challenges rewards additional Chances
Boss Challenge completions restore all Chances to full
Chances accumulate over time, giving experienced players a larger safety net

Chance Display
Chances are displayed in the game UI as glowing signal icons, styled to match the world's aesthetic. Losing one causes a visual flicker and ARIA reacts in real time.

Tools
Tools are special items that assist the player during challenges. They are earned through collecting ARIA's memory fragments and completing bonus challenges.

Available Tools
Line Reveal: Completes one line of missing code automatically
Syntax Check: Highlights any syntax errors in the player's current submission without revealing the answer
ARIA Hint: ARIA provides a context-aware spoken hint about the current challenge
Region Review: Opens a quick summary of the current region's lesson content inline without leaving the challenge

Tool Philosophy
Tools are designed to help players learn, not bypass learning. Line Reveal for example fills in one line but the player must still understand the rest. Tools should feel like a helpful nudge, not a cheat code.

The Tablet
When the Programmer is pulled into the world, they land next to a tablet. This tablet is the central UI hub for everything non-movement related in the game.

V1 Tablet Tabs (Three Only)
Current Challenge: The active code challenge, where the player writes and submits their solution
Code Library: Every lesson learned in every Learning Shrine, organized by region and concept
ARIA Hints and Chances: Current Chance count, available Tools, and ARIA's most recent hint

Post V1 Tablet Tabs
World Map: An overview of the full map showing restored and locked regions
ARIA Status: ARIA's signal strength and emotional state, plus recent dialogue log

DESIGN NOTE: Keep V1 to three tabs only. A cluttered Tablet early in the game overwhelms new players before they understand the world. Add tabs as features are built and proven.

Library Growth
Everything the player studies in a Learning Shrine is automatically added to the Code Library tab. Players can reference this material at any time, including during a challenge. The library grows with the player and becomes a personalized coding reference guide by the end of the game.

VII. Technical Architecture Overview
Tech Stack
Backend: Django (Python)
Frontend: HTML, CSS, JavaScript, Bootstrap
Deployment: Render.com
Code Execution: Sandboxed execution environment (Judge0 API or Pyodide)
Database: PostgreSQL via Render

Build Layer Approach
The game will be built in layers to avoid over-engineering early and to ensure a working product at every stage.

Layer 1: Django project setup and Render deployment
Layer 2: Basic tile-based world map rendering in JavaScript
Layer 3: Player movement (arrow keys and WASD)
Layer 4: One Challenge Gate with a hardcoded challenge
Layer 5: Code submission and sandboxed validation
Layer 6: Level complete flow and region restoration visuals
Layer 7: Tablet UI and Code Library
Layer 8: ARIA dialogue system
Layer 9: Chances system and Tools
Layer 10: Full region content, collectibles, and progression

Key Technical Decisions
Code execution must be sandboxed. Raw user code cannot run on the server directly
Judge0 is the recommended starting point for code execution as a managed API
Pyodide is an alternative that runs Python in the browser via WebAssembly
Player progress is stored in the database and tied to a user account
The world map state, restored regions, collected items, and Chance count all persist between sessions

VIII. Bug Battle System
As the player explores the open world between Learning Shrines and Challenge Gates, they will encounter roaming Bug enemies. These are living manifestations of code errors that inhabit each region. Walking into a Bug triggers a quick battle sequence where the player must find and fix the broken code to defeat it.

ARIA: "Oh wonderful. A Syntax Error. These things are everywhere. Focus, find the mistake, fix it. Do not let it touch you."

How Bug Battles Work
Triggering a Battle
Bug enemies roam the map visually as glitching pixel creatures
Walking into a Bug on the map triggers the battle screen
The battle screen displays a short broken code snippet
The player must identify and fix the error to defeat the Bug
Players can also attempt to avoid Bugs by navigating around them

Battle Outcomes
Win: The Bug is defeated, the player earns a small reward and returns to the map
Lose: The player loses 1 Chance, ARIA reacts, and the player can retry or flee
Flee: The player escapes the battle without reward or Chance loss but the Bug remains on the map

Battle Rewards
Chance Fragments for collecting toward a full extra Chance
Code Clues which are hints that can be used during the next Challenge Gate
Rare memory fragments that contribute to ARIA's collectible backstory
Bonus experience that contributes toward unlocking bonus challenges

Bug Enemy Types by Region
Each region has its own class of Bug enemy that matches the programming concept being taught in that area. The visual design of each Bug reflects its error type.

Region 1: Syntax Gnats
Error Type: Syntax Errors
Visual: Tiny flickering pixel creatures that buzz and glitch
Battle Difficulty: Very easy, one error, always obvious
Missing quotation marks around strings
Typos in variable names
Missing colons or parentheses
ARIA: "A Syntax Gnat. Basically a mosquito with a keyboard. Fix the typo and it dissolves."

Region 2: Logic Wraiths
Error Type: Logic Bugs
Visual: Shadowy figures that point in the wrong direction
Battle Difficulty: Easy, condition is reversed or broken
Conditions that are backwards, using greater than instead of less than
Wrong comparison operators producing always-true or always-false logic
Missing else branches causing unhandled cases
ARIA: "A Logic Wraith. Everything it believes is wrong. Sounds like a few people I have processed data for."

Region 3: Loop Phantoms
Error Type: Infinite Loops and Iteration Errors
Visual: Enemies that circle endlessly in repeating patterns
Battle Difficulty: Medium, player must find the missing exit condition
While loops missing their break condition
For loops with incorrect range values
Loop counters that never increment
ARIA: "A Loop Phantom. It will keep going forever if you let it. Find where it is supposed to stop."

Region 4: Scope Shades
Error Type: Scope and Variable Visibility Errors
Visual: Ghost-like enemies that flicker in and out of visibility
Battle Difficulty: Medium, variable is defined in the wrong scope
Variables used outside the function they were defined in
Local variables incorrectly treated as global
Parameters referenced with wrong names
ARIA: "A Scope Shade. It is trying to use something it cannot see. A very relatable problem, honestly."

Region 5: Index Crawlers
Error Type: Index and List Access Errors
Visual: Creatures that scramble and reorganize themselves constantly
Battle Difficulty: Medium to hard, list is accessed at a wrong or out-of-bounds index
Lists accessed at an index that does not exist
Off-by-one errors in index values
Slicing with incorrect start or end values
ARIA: "An Index Crawler. It is reaching for something that is not there. Story of this entire region."

Region 6: Type Conflicts
Error Type: Object and Class Type Errors
Visual: Two mismatched creatures fused together and fighting each other
Battle Difficulty: Hard, class or object is misused or incorrectly inherited
Methods called on the wrong object type
Inheritance chains that break expected behavior
Attributes accessed that were never defined in the class
ARIA: "A Type Conflict. Two things that should not be together, arguing about what they are. Fix the class definition."

Region 7: Corrupted Core Bugs
Error Type: Multi-error composite bugs spanning all concept types
Visual: Large, unstable, glitching creatures made of fragments of all previous bug types
Battle Difficulty: Very hard, two or three errors of different types in one snippet
Combinations of syntax, logic, scope, and type errors in a single script
Errors that interact with each other making the root cause harder to isolate
The hardest versions are mini-boss encounters guarding the path to the Null Core
ARIA: "That is a Corrupted Core Bug. Everything that went wrong in this world is in that thing. Be careful."

Boss Bugs vs Roaming Bugs
There are two tiers of Bug encounter in the game:

Roaming Bugs
Found wandering the open map between shrines and gates
Short snippets, one error, quick to resolve
Optional to fight, player can navigate around them
Serve as low stakes practice between major challenges

Boss Bugs
Found guarding the entrance to Boss Chambers
Must be defeated before the Boss Challenge can be attempted
Longer snippets with two or three errors
Cannot be avoided or fled from
Defeating them earns a full Chance restoration

ARIA's Battle Dialogue
ARIA has a unique voice for battle encounters. She reacts in real time to what is happening on screen, making every fight feel dynamic and alive.

Spotting a Bug Before the Player
ARIA: "Wait. Stop. There is a Loop Phantom two tiles ahead. Approach carefully or go around. Your call."

Player Defeats a Bug Quickly
ARIA: "Fast. I am genuinely impressed. Do not let it go to your head."

Player Takes a Hit and Loses a Chance
ARIA: "That cost you a Chance. Check your library, find what you missed, and do not let that happen again."

Player Encounters a Rare or Large Bug
ARIA: "I have not seen one of those in a long time. That is a multi-error. Take your time and work through it piece by piece."

Player Flees a Battle
ARIA: "Retreat is valid. Regroup, review, come back stronger. The bug will still be there."

Bug Battle UI
The battle screen slides in as an overlay on the map, similar to the Challenge Gate panel
The broken code snippet is displayed in the Tablet's Script tab automatically
A simple input area lets the player edit the code and submit a fix
Bug health or a remaining errors counter shows progress on multi-error Boss Bugs
ARIA's dialogue appears at the bottom of the battle screen in real time
A Flee button is available for roaming Bug battles but not for Boss Bug battles

IX. Learn to Code Section
Separate from the game world, the application includes a dedicated Learn to Code section accessible from the main navigation. This allows players to study concepts before or after playing and gives non-players access to the educational content independently.

Structure
Each region's concepts have a corresponding lesson page in the Learn section
Lessons use the same visual language and tone as the in-game Learning Shrines
ARIA appears in the Learn section as a guide, maintaining her personality
Each lesson ends with a Practice Challenge that mirrors the difficulty of Region 1 gates
Lessons are organized by concept and cross-referenced with the relevant game region

Connection to the Game
Challenge Gates in the game reference specific lesson pages when a player is stuck
Content studied in the Learn section can optionally sync to the Tablet Library if the player is logged in
The Learn section serves both players who want to prepare and players who got stuck mid-game

X. Region 1 Challenge Specifications
Before building any challenge system, every Region 1 challenge must be fully defined. These 8 challenges represent the complete Region 1 content and serve as the blueprint for the challenge engine in V1.

DESIGN NOTE: Define all challenges completely before writing any code. The challenge structure drives the validation logic, UI design, and database schema. Building the engine without knowing all the challenges leads to expensive refactoring.

Challenge 1: Power Up Terminal A
Type: Fill-in-the-blank
Gate: Challenge Gate 1
Concept: Variable assignment and strings
Lesson Reference: Code Library: Strings and Variable Assignment

terminal_name = ___status = ___print(terminal_name, "is", status)
Expected answer: terminal_name = "Terminal A", status = "online"
ARIA hint: Every terminal needs a name and a status. Assign them as text values.
ARIA: "The terminal is dark because it has no identity. Give it a name and tell it what it is."

Challenge 2: Power Up Terminal B
Type: Fill-in-the-blank
Gate: Challenge Gate 1
Concept: Variable assignment, integers and booleans
Lesson Reference: Code Library: Integers, Booleans

power_level = ___is_active = ___print("Power:", power_level, "Active:", is_active)
Expected answer: power_level = 100, is_active = True
ARIA hint: Power level is a whole number. Active status is either True or False.
ARIA: "Numbers for quantities. True or False for states. Keep it simple."

Challenge 3: Identify the Data Types
Type: Fill-in-the-blank, multiple blanks
Gate: Challenge Gate 2
Concept: Data type identification across all four types
Lesson Reference: Code Library: All data types

programmer_name = ___years_coding = ___has_coffee = ___favorite_number = ___
Expected answer: programmer_name = "Alex", years_coding = 5, has_coffee = True, favorite_number = 3.14
ARIA hint: One of each type. String, integer, boolean, and float.
ARIA: "Four variables. Four types. You know all of them. Do not overthink it."

Challenge 4: Fix the Broken Variable
Type: Bug fix, find and correct the error
Gate: Challenge Gate 2
Concept: Syntax errors in variable assignment
Lesson Reference: Code Library: Variable Assignment

node_id = "Origin-01power = 10Ois_connected = true
Expected fixes: Missing closing quote on string, letter O instead of zero in integer, true should be True
ARIA hint: Three errors. Look carefully at each line. One is a quote problem, one is a number problem, one is a capitalization problem.
ARIA: "Something is wrong on every line. Find all three before you submit."

Challenge 5: String Formatting
Type: Fill-in-the-blank with string formatting
Gate: Challenge Gate 3
Concept: String formatting and f-strings
Lesson Reference: Code Library: String Formatting

name = "ARIA"status = "online"message = ___print(message)
Expected answer: message = f"{name} is now {status}"
ARIA hint: Use an f-string to combine the name and status into one message.
ARIA: "I need you to announce my return. Make it sound good."

Challenge 6: Bug Battle, Syntax Gnat Encounter
Type: Bug battle, roaming enemy
Location: Roaming the Origin Node map
Concept: Syntax error identification
Lesson Reference: Code Library: Variable Assignment

greeting = "Hello Worldprint(greeting)
Expected fix: Add closing quote after World
Reward: 1 Chance Fragment on defeat
ARIA: "Syntax Gnat. Missing quote mark. Squash it fast."

Challenge 7: Boss Bug, Gate to Boss Chamber
Type: Boss Bug battle, multi-error
Location: Entrance to Origin Node Boss Chamber
Concept: All Region 1 data types and syntax
Lesson Reference: Full Code Library: Region 1

node_name = Origin Nodepower_remaining = "87"backup_active = Falseprint(f"Node: {node_name}, Power: {power_remaining}")
Expected fixes: node_name needs quotes around Origin Node, power_remaining should be integer 87 not string "87"
Reward: Full Chance restoration on defeat
ARIA: "This one has two errors hiding in it. Take your time. We are close to the Boss Chamber."

Challenge 8: Boss Challenge, Who Are You
Type: Partial open code with scaffolding
Location: Origin Node Boss Chamber
Concept: All Region 1 concepts combined
Lesson Reference: Full Code Library: Region 1

The player is given a scaffolded script with comments explaining what each variable should hold. They must fill in all values correctly using the right data types and then write one f-string that prints a complete summary.

# Your name as a stringyour_name = ___# Your age as an integeryour_age = ___# Are you a programmer? True or Falseis_programmer = ___# Your version number as a floatversion = ___# Print a summary using an f-stringprint(___)
Validation checks all four data types are correct and the f-string references at least two variables
Reward: Region 1 fully restored, ARIA signal expands, Region 2 unlocked
ARIA: "Tell the system who you are. All of it. This is how we prove you belong here."

XI. The Practice Area
Not every user wants to play a game. The Practice Area is a standalone section of the application that makes all challenge content available outside of the game world. No map, no story, no mechanics to learn before learning to code. Just clean challenges, a code editor, and a submit button.

The Practice Area is the third pillar of ARIA: The Lost Code alongside the game and the Learn to Code section. Together the three areas serve every type of learner.

Play  The full ARIA game experience with map, story, and progressionLearn  Lesson content organized by concept, tied to game regionsPractice  Standalone challenges and bug fixes outside the game world

Who the Practice Area Serves
Learners who want to practice coding without the game context or story overhead
Players who got stuck on a challenge in the game and want to drill the concept standalone
Educators who want to assign specific challenges to students without requiring full game play
Returning users who want to review a concept quickly without replaying a region
Curious visitors who want to try coding before committing to the full game

Practice Area Structure
Challenge Browser
The Practice Area opens to a browsable library of all available challenges. Users can filter and sort by:
Concept: Variables, Conditionals, Loops, Functions, Lists, OOP, Debugging
Type: Fill-in-the-blank, Bug fix, Open code, Boss challenge
Difficulty: Beginner, Intermediate, Advanced
Region: Origin Node, Logic Fields, Loop Caverns, and so on

Each challenge card in the browser shows the concept, type, difficulty badge, and an estimated completion time. Completed challenges show a checkmark for logged-in users.

The Challenge Interface
When a user opens a challenge the interface is intentionally minimal:
Challenge title and a one-line description of the scenario
The code snippet or fill-in-the-blank template
A clean code editor for the user to write or complete their solution
A Submit button and a Reset button
A Hint button that reveals a text hint without showing the answer
A Show Solution button that appears only after two failed attempts

DESIGN NOTE: The Practice Area deliberately strips away all game elements. No Chances, no ARIA story arc, no map. The goal is zero friction between the learner and the code challenge. Speed of access matters here more than atmosphere.

Feedback and Validation
Correct submissions display a success message with a brief explanation of why the solution works
Incorrect submissions display a specific error message pointing to what went wrong
No penalty system in the Practice Area. Unlimited attempts with no consequence
After a correct submission the user is offered the next challenge in the same concept or a related one

ARIA in the Practice Area
ARIA appears in the Practice Area as a lightweight hint assistant rather than a full story character. She does not deliver narrative dialogue here. She is purely functional but still has her personality.

A small ARIA avatar sits in the corner of the challenge interface
Clicking her triggers a context-aware hint about the current challenge
Her hint dialogue is witty and on-brand but brief and instructional
She does not reference the game story or her own situation in this context

ARIA: "I am not going to tell you the answer. But I will tell you where to look."

Content Shared With the Game
All Practice Area challenges are sourced from the same content database as the game. This means:
Challenges are built once and published to both the game and the Practice Area simultaneously
Bug battle snippets from the game appear as standalone bug fix exercises in Practice
Challenge Gate challenges appear as fill-in-the-blank exercises
Boss challenges appear as capstone exercises at the end of each concept group
Any new challenge added to the game is automatically available in Practice

DESIGN NOTE: The shared content model means the Practice Area costs almost nothing extra to maintain. It is not a separate product, it is a different view into the same challenge database. Build challenges once, serve them everywhere.

Progress Tracking in Practice
Logged-in users have their Practice completions saved to their profile
A progress bar per concept shows how many challenges have been completed
Completed challenges are marked in the browser so users know what they have already done
Practice completions do not affect game progress or Chances but do appear on the user profile
A streak system rewards users who complete at least one Practice challenge per day

Practice Area and the Learn Section Connection
The Practice Area and the Learn to Code section are tightly linked:
Every lesson in the Learn section ends with a link to the related Practice challenges
Every Practice challenge includes a link to the relevant Learn section lesson
Users who arrive at a challenge and get stuck can jump directly to the lesson and return
This creates a natural study loop: read the lesson, attempt the practice, return to lesson if stuck, retry

V1 Practice Area Scope
Version 1 of the Practice Area will include all Region 1 challenges only, matching the V1 game content.

All 8 Region 1 challenges available as standalone Practice exercises
Basic challenge browser with concept and type filters
Minimal challenge interface with hint and show solution options
ARIA hint avatar with Region 1 specific hint dialogue
No progress tracking in V1, that comes post-launch

DESIGN NOTE: The Practice Area is also an excellent testing ground. Before a challenge goes into the game it can be published to Practice first to see how real users interact with it. Poorly designed challenges reveal themselves quickly without game context to hide their flaws.

XII. Version 1 Scope
Version 1 of ARIA: The Lost Code will focus on establishing the core game loop cleanly before expanding content. The following defines what is and is not included in V1.

V1 Includes
Full cinematic opening sequence
Character creation with name input and gender selection
Region 1: The Origin Node, fully playable with all shrines, gates, and boss challenge
Basic Tablet UI with Script, Library, and Chances tabs
ARIA dialogue for Region 1
Chances system with 3 starting chances
One Tool: ARIA Hint
Learn to Code section for Region 1 concepts
Syntax Gnats: Region 1 roaming bug enemies with basic battle UI
One Boss Bug guarding the Region 1 Boss Chamber
Render deployment pipeline

Post V1 Roadmap
Regions 2 through 7 with full content
All Bug enemy types for Regions 2 through 7
Boss Bugs for all regions
Full battle reward system including Chance Fragments and Code Clues
Full Tools inventory
Hidden collectibles and memory fragments
World map with visual restoration effects
ARIA emotional arc and battle dialogue across all regions
User accounts and progress persistence
Bonus challenges
Full Learn to Code section for all concepts

---

XIII. Technical Decisions Log

This section records every significant technical or design decision made during development. All decisions are recorded here so they can be referenced, revisited, or reversed with full context. Any decision not documented here should be considered undecided.

Tech Stack Decisions

Code Execution Engine: Pyodide
Decision: Use Pyodide (Python in the browser via WebAssembly) for all code validation in V1.
Rationale: Pyodide is free, requires no API key, and runs entirely in the player's browser. There is no server-side code execution risk. V1 challenges are simple enough (fill-in-the-blank, short bug fixes) that client-side execution covers all cases. Judge0 API remains the post-V1 fallback if more complex execution is needed.
Implication: The database stores expected_output (the exact stdout string the correct solution produces). Pyodide runs the player's code in the browser, captures stdout, and compares it to expected_output. No code ever reaches the server.

Frontend Game Engine: Phaser.js 3
Decision: Use Phaser.js 3 (loaded via CDN) for the tile-based game world.
Rationale: Phaser handles tile maps, sprite movement, camera, input, and tweens natively. Building equivalent functionality in vanilla canvas JS would require rebuilding what Phaser already provides.
Version: Phaser 3.70.0
CDN: https://cdn.jsdelivr.net/npm/phaser@3.70.0/dist/phaser.min.js
Build pipeline: None. V1 uses plain script tags in order. No webpack, vite, or bundler required.

JavaScript Module System: Global Namespace (No ES Modules in V1)
Decision: All game JavaScript files share a single global namespace object (window.ARIA_GAME) rather than using ES module import/export syntax.
Rationale: ES modules require either a bundler or a type="module" attribute, which introduces CORS constraints on local dev and additional complexity. For V1 with a small number of scripts, ordered script tags with a shared global namespace is simpler and more debuggable.
Convention: Every game JS file begins with window.ARIA_GAME = window.ARIA_GAME || {}. Constants and classes are attached to this object. Files destructure what they need at the top.

Django App Responsibilities
Decision: The learn and practice apps contain no database models.
Rationale: The Bible explicitly states that Practice Area content is sourced from the same database as the game (challenges built once, served everywhere). The learn app mirrors Learning Shrine content from the game app. Both apps are purely view and template layers that query game.Challenge and game.ShrineTopic.
Implication: game/ owns all content models. learn/ and practice/ own only views, URLs, and templates.

Character Creation Timing
Decision: A PlayerProfile record is created when the player completes character creation on their first play session, not at account registration.
Rationale: A user may register but never play. The profile (display_name, gender, chances, current_region) only makes sense in the context of playing the game. This avoids creating incomplete profile records for users who register but never start.
Implication: A Django User can exist without a PlayerProfile. All game views must handle the case where request.user.profile does not exist yet and redirect to character creation.

Validation Logic: First Attempt is Free
Decision: The first wrong answer at any Challenge Gate or Boss Chamber costs no Chance. A Chance is deducted on the second wrong answer onward.
Rationale: Defined in the Bible (Section VI). The PlayerChallengeProgress.record_attempt() method returns a boolean indicating whether the attempt was the first, so the view knows whether to call player.lose_chance().

Map and World Decisions

Tile Size: 32 x 32 pixels
Decision: All tiles are 32 x 32 pixels.
Rationale: Standard tile size for top-down 2D games. Large enough to be readable, small enough to fit useful map area on screen. Adjustable per-region later if needed.

Tile Format: 2D Integer Arrays
Decision: Tile maps are defined as JavaScript 2D arrays of integers in static/js/game/maps/. Each integer maps to a tile type constant defined in config.js.
Rationale: No external tilemap editor required for V1. Maps can be read and edited directly. Easy to version control. Tiled editor integration is a post-V1 option.

Tile Type Registry (Origin Node)
0 = WALL: impassable outer boundary and internal blockers
1 = FLOOR: passable open area
2 = ROAD: passable highlighted path (circuit board aesthetic)
3 = SHRINE: impassable 2x2 building (player interacts by bumping from adjacent tile)
4 = GATE: impassable Challenge Gate (blocks road until challenge solved)
5 = BOSS_CHAMBER: impassable (blocks until Boss Bug defeated)
6 = TERMINAL: impassable decoration (dead screen or data terminal)
7 = BOSS_BUG: impassable enemy (triggers Bug Battle on bump)
8 = SPAWN: renders as FLOOR, marks player starting position

Origin Node Map Layout
Dimensions: 25 columns x 18 rows = 800 x 576 pixels (no camera scrolling required)
Road structure: Rectangular loop
  Top road:    row 5, columns 4 to 21
  Left road:   column 4, rows 5 to 10
  Bottom road: row 10, columns 4 to 21
  Right road:  column 21, rows 5 to 10

Key positions (column, row):
  Player spawn:  (7, 7) inside the road loop
  Shrine 1:      (5-6, 3-4) upper left, teaches Variables and Data Types
  Gate 1:        (7, 5) on top road, requires Challenges 1 and 2
  Gate 2:        (12, 5) on top road, requires Challenges 3 and 4
  Shrine 2:      (9-10, 8-9) inside loop, teaches String Formatting
  Gate 3:        (13, 8) inside loop lower area, requires Challenge 5
  Boss Bug:      (18, 5) on top road, guards Boss Chamber
  Boss Chamber:  (22-23, 5-6) far right, contains Boss Challenge

Visual tile colors (prototype, will be replaced by pixel art in post-V1):
  WALL:         #0d0d1a  (near-black blue)
  FLOOR:        #1a1a2e  (dark navy)
  ROAD:         #16213e  (lighter navy with yellow center line detail)
  SHRINE:       #0d3320  (dark green)
  GATE:         #3a1515  (dark red with X marker)
  BOSS_CHAMBER: #2a1535  (dark purple with border marker)
  TERMINAL:     #0d2233  (dark blue-teal with crosshair marker)
  BOSS_BUG:     #2a0d0d  (very dark red with circle marker)

Player Representation (prototype)
Outer glow ring: 28px diameter circle, #00ff88 at 15 percent opacity
Body: 20px diameter filled circle, #00ff88
Direction indicator: 6px circle offset in movement direction, #001a0d
Movement: smooth tween between tiles, 120ms duration

ARIA Dialogue Bar
Position: fixed bottom strip, 80px tall
Avatar: 48px circle with lightning bolt glyph, bordered in #00ff88
Text: monospace font, #00ff88 color
HUD: Chance icons (glowing green dots) and Tablet button, same bar

---

XIV. Build Progress Log

Layer 1: Django Project Setup and Render Deployment
Status: Complete
Notes: Django 6.0.3, PostgreSQL, WhiteNoise for static files, gunicorn, Render.com deployment pipeline via render.yaml. Settings split into base/dev/prod. Django-axes for brute-force login protection. Debug toolbar in dev. Pre-commit hooks configured. Auth flow (login, logout, password reset) fully templated.

Step 1: Database Models
Status: Complete
Date: 2026-05-21
Files created:
  accounts/models.py       PlayerProfile
  accounts/admin.py        PlayerProfile admin registration
  game/models.py           Region, LearningShrine, ShrineTopic, Challenge,
                           PlayerRegionProgress, PlayerChallengeProgress,
                           MemoryFragment, PlayerMemoryFragment, PlayerTool
  game/admin.py            Full admin registration for all game models
  accounts/migrations/0001_initial.py
  accounts/migrations/0002_initial.py  (cross-app FK to game.Region)
  game/migrations/0001_initial.py
Notes: learn/ and practice/ apps have no models. accounts migration split into two files automatically by Django due to circular FK between PlayerProfile and Region.

Layer 2: Tile-Based World Map Rendering (Phaser.js)
Status: Complete
Date: 2026-05-21
Files created:
  static/js/game/config.js           Tile constants, color palette, labels
  static/js/game/maps/origin_node.js  Origin Node 25x18 tile array + spawn point
  static/js/game/scenes/OriginNodeScene.js  Phaser 3 scene: texture generation, map render, player, camera, input, movement, interaction events
  static/js/game/main.js             Phaser game config and boot
  game/views.py                      GameView (TemplateView)
  game/urls.py                       /play/ URL
  templates/game/game.html           Full-screen game template with ARIA bar and HUD
Notes: All tiles drawn programmatically using Phaser Graphics. No external image assets required. Player spawns at (7,7), inside the road loop of the Origin Node.

Layer 3: Player Movement (WASD and Arrow Keys)
Status: Complete (implemented within Layer 2 scene)
Notes: Tile-by-tile movement with 120ms tween. Player cannot enter IMPASSABLE tiles. Bumping an INTERACTIVE tile emits an interact event (gate, shrine, boss bug, boss chamber). The direction indicator (eye) tracks last movement direction.

Layer 4: One Challenge Gate with Hardcoded Challenge
Status: Complete
Date: 2026-05-21
Files created:
  static/js/game/data/region1_challenges.js  All 8 Region 1 challenges hardcoded
                                              (Layer 10 replaces with API fetch)
  static/js/game/challenge.js                ChallengePanel class - overlay, editor,
                                             hint, submit, result, event emission
Files updated:
  static/js/game/scenes/OriginNodeScene.js   Added tileImages registry, updateTile(),
                                             _listenToBus(), inputLocked flag
  static/js/game/main.js                     Gate progress state, aria:interact routing,
                                             challenge:solved gate-open logic, Chances HUD
  templates/game/game.html                   Challenge panel HTML + CSS, new script tags
Notes:
  Validation in this layer is keyword-based string matching (temporary).
  Layer 5 replaces it entirely with Pyodide execution vs. expected_output.
  Gate 1 presents Challenges 1 and 2 sequentially. Both must be solved to open the gate.
  Challenge panel slides up from below the ARIA bar on gate bump.
  First wrong answer: hint shown automatically, no Chance lost (per Bible Section VI).
  Second+ wrong answer: Chance deducted, ARIA fail dialogue.
  Ctrl+Enter submits. Esc closes the panel.
  Boss Bug tile cleared and Chances restored to full on Boss Bug defeat (per Bible).

Layer 5: Code Submission and Pyodide Validation
Status: Complete
Date: 2026-05-21
Files created:
  static/js/game/pyodide_runner.js   PyodideRunner class - loads Pyodide from CDN,
                                     captures stdout, cleans Python tracebacks
Files updated:
  static/js/game/challenge.js        _submit and _validate are now async;
                                     stdout displayed in output section;
                                     loading state on submit button
  static/js/game/data/region1_challenges.js
                                     Added validation_code to ch3, ch4, ch8
                                     (challenges with no print statement that need
                                     type-checking rather than stdout comparison)
  static/js/game/main.js             PyodideRunner instantiated and pre-warmed on
                                     page load; pyodide:ready → status indicator
  templates/game/game.html           Pyodide CDN script tag, output section HTML+CSS,
                                     pyodide-status indicator in ARIA bar,
                                     pyodide_runner.js script tag
Notes:
  Pyodide CDN: https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js
  Pyodide loads eagerly on page load (~10MB, takes a few seconds on first visit).
  Status indicator in ARIA bar shows "loading..." then "ready" then fades out.
  Two validation modes:
    Standard: stdout.trim() === expected_output.trim()
    Sentinel: challenge has validation_code; stdout must end with __VALID__
  Challenges ch3 and ch4 use sentinel mode (no print in player code - types checked).
  Challenge ch8 uses sentinel mode (player's print runs first, then type checks).
  No infinite-loop timeout in V1. Region 1 challenges cannot produce loops.
    Post-V1: move Pyodide to a Web Worker, add interrupt mechanism.
  Error messages from Python tracebacks are cleaned (last line only shown to player).

Layer 6: Level Complete Flow and Region Restoration Visuals
Status: COMPLETE (2026-05-21)

Files changed:
  static/js/game/scenes/OriginNodeScene.js
    - _generateTileTextures(): ROAD_RESTORED (9) = bright green circuit trace + corner dots;
      FLOOR_LIT (10) = warm green grid lines - both fully drawn programmatically.
    - _listenToBus(): region:restore → _restoreRegion()
    - _restoreRegion(AG): camera flash → player glow burst → collects all ROAD/FLOOR
      tiles sorted by Manhattan distance from boss chamber at (22,5) → staggered
      updateTile() calls at dist*28 ms per tile → emits region:restored after
      maxDelay + 600 ms.
    - updateTile(col, row, newTileId): destroys old image, creates new image, fade-in tween.

  static/js/game/main.js
    - boss:solved handler: emits aria:speak then schedules region:restore via setTimeout(800)
      so the challenge panel fully closes before the Phaser wave begins.
    - region:restored handler: adds .visible to #region-complete-overlay; double-rAF
      animates #rc-signal-fill to 14.3% width.
    - Continue button listener: removes .visible, resets fill to 0%, emits aria:speak.

  templates/game/game.html
    - CSS: #region-complete-overlay (fixed, z-index 200, opacity transition); #region-complete-card
      (scale spring animation via cubic-bezier(0.34,1.56,0.64,1)); .rc-avatar pulse keyframes;
      .rc-signal-bar-fill (width 0→14.3% transition with 0.5s delay); .rc-badge; #rc-continue-btn.
    - HTML: #region-complete-overlay containing #region-complete-card with ARIA avatar,
      "SIGNAL RESTORED" / "THE ORIGIN NODE - ONLINE" heading, ARIA dialogue, signal
      strength bar (14%, 1/7 regions), "Concept Mastered: Python Basics" badge,
      Continue button.

Event flow summary:
  boss:solved → (800ms) → region:restore → OriginNodeScene ripple wave
    → region:restored → overlay .visible + bar animates
    → Continue click → overlay hides, ARIA speaks closing line

Layer 7: Tablet UI and Code Library
Status: COMPLETE (2026-05-21)

Files changed:
  static/js/game/tablet.js  (NEW)
    - _REGION1_LESSONS: 5 lesson objects (Variables, Data Types, Type Conversion,
      Strings, Lists), each with an array of typed sections (text/code/list).
    - Tablet class:
        open(tab?)         - adds .open to overlay, starts Escape listener
        close()            - removes .open, removes Escape listener
        switchTab(name)    - toggles .active on tab buttons + panels
        setActiveChallenge(challenge) - populates Challenge tab
        addHint({text, title})        - logs hint to ARIA tab (newest first)
        updateChances(count)          - syncs chance dots + "N / 3" label
        _buildLibrary()    - generates .lib-card HTML from _REGION1_LESSONS
        _buildSection(s)   - renders text/code/list blocks
        _escHtml(str)      - escapes < > & for safe <pre> insertion

  static/js/game/challenge.js
    - open(): emits challenge:opened { challenge } after challenge:open
    - _showHint(): emits hint:shown { text, title } on first reveal per challenge

  static/js/game/main.js
    - updateChancesDisplay(): now calls AG.tablet?.updateChances(count) to keep
      Tablet in sync without an extra event listener.
    - Section 11 replaced stub with:
        AG.tablet = new AG.Tablet()
        tabletBtn click → AG.tablet.open() (blocked while challenge panel open)
        challenge:opened → AG.tablet.setActiveChallenge(challenge)
        hint:shown       → AG.tablet.addHint(data)

  templates/game/game.html
    - CSS: #tablet-overlay (fixed, z-index 150), #tablet-backdrop (opacity transition),
      #tablet-drawer (right-side, translateX slide), tab bar (.tablet-tab-btn),
      .tablet-panel (absolute, overflow-y:auto), challenge/library/ARIA tab styles,
      library card system (.lib-card, .lib-text, .lib-code, .lib-list),
      ARIA tab (.tablet-chance-dot, .tablet-hint-item).
    - HTML: #tablet-overlay > #tablet-backdrop + #tablet-drawer with header,
      three-tab bar, and three .tablet-panel divs (challenge / library / aria).
    - Script: tablet.js added between challenge.js and main.js.

Tab summary (V1):
  Challenge - shows active challenge title, ARIA intro, prompt code, lesson ref.
              Populated on challenge:opened; note reminds player to use the gate editor.
  Library   - 5 static Region 1 lesson cards. Grows via shrines in Layer 10.
  ARIA      - 3 chance dots (synced with HUD), hints log (newest first), tools stub.

Layer 8: ARIA Dialogue System
Status: COMPLETE (2026-05-21)

Files changed:
  static/js/game/dialogue.js  (NEW)
    - DialogueSystem class, constructor takes the #aria-text DOM element.
    - say(text)          - interrupt + typewriter (for game events via aria:speak)
    - append(lines)      - queue without interrupting (for narrative sequences)
    - trigger(id, lines) - one-time proximity trigger; skips if ARIA is busy
    - _startTyping(text) - typewriter at 15ms/char; holds 2600ms after line complete
    - _advanceQueue()    - shifts next line from queue; sets _typing=false when empty
    - _interrupt()       - clears timer + queue + flag (used by say())
    - _firedTriggers     - Set; prevents proximity zones from repeating per session

  static/js/game/data/region1_dialogue.js  (NEW)
    - REGION1_ZONES: 7 proximity trigger objects
        { id, col, row, radius, lines[] }
        Zones: approach_shrine1, approach_gate1, approach_gate2, approach_shrine2,
               approach_gate3, approach_boss_bug, approach_boss_chamber
        Distances use Manhattan metric; radii range 2–3 tiles.
    - REGION1_EVENTS.first_steps: 2-line sequence appended on player's first move
      (plays after the opening one-liner rather than replacing it).

  static/js/game/scenes/OriginNodeScene.js
    - _movePlayer(): emits AG.events.emit('player:moved', { col, row }) when
      tileX/tileY update (before tween), triggering the proximity checker.

  static/js/game/main.js
    - Section 2 (new): AG.dialogue = new AG.DialogueSystem(#aria-text element)
      created before Phaser boots so the very first aria:speak goes through it.
    - Section 6 (aria:speak handler): replaced fade+setTimeout with AG.dialogue.say(text).
    - Section 12 (new): player:moved handler
        first_steps trigger: AG.dialogue.append() on first movement from spawn
        proximity scan: O(n) zone check per step; breaks on first match within radius

  templates/game/game.html
    - Script tags: data/region1_dialogue.js (before pyodide_runner.js)
                   dialogue.js (before main.js)

Dialogue system flow:
  Scene creates → aria:speak → say() → typewriter types opening line (1.1s) → holds 2.6s
  Player first moves → player:moved → append(first_steps) → queue for after hold
  Player approaches gate1 → player:moved → trigger('approach_gate1', ...) if idle
  Player bumps gate → aria:speak → say() → interrupts any ambient trigger sequence
  All challenge events (correct/wrong/hint) continue via aria:speak → say()

Layer 9: Chances System and Tools
Status: COMPLETE (2026-05-21)

Files changed:
  game/views.py
    - player_state()  GET /api/player-state/ → { chances, has_profile, display_name }
      Returns profile.chances if profile exists, else default 3.
    - sync_chances()  POST /api/chances/sync/ body:{ chances: N }
      Saves to profile.chances (0–99 clamped). Silently succeeds if no profile yet.
      Both views are login-required; CSRF verified via X-CSRFToken header.

  game/urls.py
    - path('api/player-state/', views.player_state, name='player_state')
    - path('api/chances/sync/',  views.sync_chances,  name='sync_chances')

  templates/game/game.html
    - CSS: @keyframes chance-lost-flicker (5-step opacity flicker, 0.55s)
           .chance-dot.flicker (applies animation)
           .tool-card, .tool-card-header, .tool-name, .tool-charges,
           .tool-desc, .tool-use-btn (ARIA Hint tool card styling)
    - HTML: ARIA tab Tools section replaced with real tool card:
            💡 ARIA Hint, ∞ charges, "▶ Use" button (#aria-hint-tool-btn)

  static/js/game/main.js
    - AG.chancesEmpty = false (flag; set to true when chances hit 0)
    - _getCsrfToken(): reads csrftoken cookie for AJAX POSTs
    - _syncChances(count): fire-and-forget POST to /api/chances/sync/
    - updateChancesDisplay(): now detects dots transitioning to lost state
      and applies .flicker class (auto-removed after 600ms)
    - chance:lose handler: calls _syncChances(); when currentChances===0,
      sets AG.chancesEmpty=true and schedules AG.challengePanel.close() after 2200ms
    - chance:restore handler: clears AG.chancesEmpty, calls _syncChances(3)
    - _handleGateInteraction(): returns early with ARIA speech if AG.chancesEmpty
    - Section 5 (new): fetch('/api/player-state/') on page load - initialises HUD
      from persisted count; sets AG.chancesEmpty=true if count===0
    - ARIA Hint tool button: #aria-hint-tool-btn click →
        if AG.tablet._activeChallenge: emit aria:speak with hint_text, close Tablet
        else: emit aria:speak "No active challenge", close Tablet

Behaviour summary:
  Page loads → fetch player-state → HUD dots reflect persisted chances
  Wrong answer (2nd+) → chance:lose → flicker + decrement → _syncChances
  Chances hit 0 → chancesEmpty=true → panel auto-closes at 2200ms
  Player bumps gate with chancesEmpty → aria:speak "No chances remaining"
  Boss Bug defeated → chance:restore → chancesEmpty=false → all gates unlock → _syncChances(3)
  ARIA Hint tool → speaks hint for active challenge via typewriter → closes Tablet

Layer 10: Full Region 1 Content, Collectibles, and Progression
Status: Complete

Components delivered:

1. Character Creation flow
   game/views.py          - character_create() view (GET/POST)
                            GET: renders character_creation.html
                            POST: validates display_name (1–50 chars) + gender (male/female),
                                  creates PlayerProfile, creates PlayerRegionProgress for Region 1
                                  (is_unlocked=True), redirects to game:play
                            Guard: if profile already exists → redirect to game:play immediately
   game/urls.py           - path('character/', views.character_create, name='character_create')
   templates/game/character_creation.html
                          - ARIA-themed centered card; scanline body overlay; ARIA greeting block
                            (avatar + typewriter text); display name input; gender selector
                            (two radio cards with emoji icons, CSS :checked state); error display;
                            submit button; csrf_token; POST re-populates fields on validation fail
   game/views.py          - GameView.get() now checks for profile; redirects to character_create
                            if request.user has no related profile

2. Learning Shrine modal
   static/js/game/data/region1_shrines.js  (NEW)
     Two shrine objects keyed shrine1/shrine2:
       shrine1  cols:[5,6] rows:[3,4]  name:'Shrine of Origins'
                topics: Variables & Assignment, Data Types, Type Conversion
       shrine2  cols:[9,10] rows:[8,9] name:'Shrine of Expression'
                topics: String Formatting - f-strings, Lists
     Each topic has sections typed text/code/list following the same shape as tablet.js lessons.

   static/js/game/shrine.js  (NEW)
     class ShrineModal:
       constructor()     - binds close button, backdrop click, ESC keydown
       open(shrine)      - sets title, renders topics via _renderShrine(), adds .open class,
                           emits aria:speak with shrine.aria_intro
       close()           - removes .open class
       _renderShrine()   - maps topics → _renderTopic()
       _renderTopic()    - renders topic number, title, sections via _renderSection()
       _renderSection()  - type: text → <p>, code → <pre> (HTML-escaped), list → <ul>
       _escHtml()        - escapes & < > " for code blocks
     window.ARIA_GAME.ShrineModal = ShrineModal

   templates/game/game.html  (UPDATED)
     CSS: #shrine-overlay (z-index 120), #shrine-backdrop, #shrine-modal (scale spring transition),
          #shrine-header, #shrine-title, #shrine-close, #shrine-body (scrollable),
          .shrine-topic, .shrine-topic-number, .shrine-topic-title, .shrine-topic-body,
          .shrine-text (+ inline code), .shrine-code (green left border), .shrine-list (+ code)
     HTML: #shrine-overlay > #shrine-backdrop + #shrine-modal (with header, body)
           inserted before #region-complete-overlay
     Script tags: region1_shrines.js and shrine.js added in load order

   static/js/game/main.js  (UPDATED)
     Section 11 (new): AG.shrineModal = new AG.ShrineModal()
                        _identifyShrine(col, row) - scans AG.SHRINES for a shrine whose
                        cols/rows arrays include the given position; returns shrine or null
     aria:interact shrine branch: calls _identifyShrine(); opens AG.shrineModal.open(shrine)
                                  if matched; fallback ARIA speak if not matched
     Subsequent sections renumbered: Tablet → 13, Proximity dialogue → 14

3. Django management command  (NEW)
   game/management/__init__.py  (empty)
   game/management/commands/__init__.py  (empty)
   game/management/commands/load_region1.py
     Command: load_region1   --reset flag (destructive wipe before reload)
     Loads in one @transaction.atomic block:
       Region 1 (The Origin Node) - slug origin-node, order 1, unlocked_by_default True
       Shrine 1 (Shrine of Origins)  - 3 ShrineTopic records (Variables, Data Types, Type Conversion)
       Shrine 2 (Shrine of Expression) - 2 ShrineTopic records (f-strings, Lists)
       8 Challenge records mapping to all game challenges:
         ch1 fill_blank gate beginner      - Power Up Terminal A
         ch2 fill_blank gate beginner      - Power Up Terminal B
         ch3 fill_blank gate beginner      - Identify the Data Types
         ch4 bug_fix    gate beginner      - Fix the Broken Variable
         ch5 fill_blank gate beginner      - String Formatting
         ch6 bug_fix    roaming_bug beginner - Syntax Gnat
         ch7 bug_fix    boss_bug intermediate - Boss Bug - Gate to Boss Chamber
         ch8 boss       boss_chamber intermediate - Who Are You - Boss Challenge
     All fields populated including solution_code (server-side reference).
     Fully idempotent: get_or_create + field update on existing records.

Run sequence on a fresh install:
  python manage.py migrate
  python manage.py load_region1
  python manage.py createsuperuser
  # First player visit: /character/ → creates PlayerProfile → /play/

---

Layer 11: Registration, Cinematic, Visual Overhaul, Challenge UX, Subscription Gate
Status: COMPLETE (2026-05-21)

Registration
  accounts/views.py     - RegisterForm (username, email, password1, password2)
                          register() view: GET renders form, POST validates,
                          creates User, auto-logs in, redirects to character_create
  config/urls.py        - path('accounts/register/', name='register')
  templates/registration/register.html
                        - ARIA-themed card matching character creation aesthetic;
                          password strength bar (5-level color + label);
                          "Already have an account? Sign in" footer link
  templates/registration/login.html
                        - Fully restyled to match ARIA dark theme;
                          ARIA greeting "Connection attempt detected";
                          error shows single generic message not raw Django errors
  templates/base.html   - Navbar: added Register + Sign In links for unauthenticated users

Opening Cinematic
  static/js/game/scenes/CinematicScene.js  (NEW)
    Phaser scene. Runs before OriginNodeScene. Skipped on return visits
    via localStorage 'aria_cinematic_seen' = '1'.
    Sequence: office scene (3 monitors, desk, programmer silhouette) →
              CRACK flash + blackout → power restored → ARIA terminal streams text →
              [YES]/[NO] buttons → suck-in effect → fade to black → OriginNodeScene.
    Skip: Space, Enter, or skip button in top-right corner at any time.
  main.js               - scene array updated to [CinematicScene, OriginNodeScene]
  game.html             - CinematicScene.js added before OriginNodeScene.js in load order

Visual Overhaul
  static/js/game/scenes/OriginNodeScene.js  (REWRITTEN)
    _generateTileTextures(): All 11 tile types fully redrawn:
      WALL - offset stone brick pattern
      FLOOR - subtle cross-grid + corner dots
      ROAD - PCB circuit trace with solder pads at intersections
      SHRINE - dark green floor base (building drawn as overlay)
      GATE - dual stone pillars + horizontal energy barrier beam
      BOSS_CHAMBER - heavy columns + lintel + purple energy field + diamond sigil
      TERMINAL - monitor casing, screen, scanlines, cursor, LED, stand
      BOSS_BUG - warning stripe base (bug drawn as overlay)
      ROAD_RESTORED - bright green circuit trace + glow pads
      FLOOR_LIT - warm green grid + corner glow dots
    _generatePlayerTextures(): Human silhouette in 32×32 texture:
      Shadow ellipse, legs, torso, arms, neck, head (lighter tint), eyes, highlight.
      setFlipX() on direction change - one texture, mirrored for left-facing.
      Vertical bob tween during movement.
    _renderShrineOverlays(): Draws a unified 64×68 temple building over each 2×2 shrine block:
      Stone base platform, steps, columns with capitals, door arch with glow,
      triangular gabled roof, lightning bolt sigil in gable. Gentle pulse tween.
    _renderBossBugOverlays(): Draws actual insect sprite over boss_bug tile:
      6 legs (angled outward), 2 antennae with tips, abdomen + stripes, thorax,
      head, glowing yellow eyes with white glint. Boss has wider aura.
      Idle wriggle + alpha pulse tweens. Fades out on boss_bug:clear event.
    _createPlayer(): Replaced circle with humanoid image sprite + shadow ellipse.

Challenge UX
  challenge.js
    _updateEditorLabel(): Dynamic label per challenge type:
      fill_blank → "replace each ___ ... (N blanks)"
      bug_fix    → "edit below to fix the bug(s)"
      boss       → "write your complete solution"
    Expected output preview (#cp-expected-hint): Shows "Your code should output: X"
      for challenges with a non-empty expected_output. Hidden on submit.
    Bug-fix banner (#cp-bugfix-banner): Orange left-bordered banner for bug_fix type.
    Tab key in editor: inserts 4 spaces instead of moving focus.
  region1_challenges.js
    ch3: Added print(type(...)) line so players see type feedback in the output box.
         expected_output updated to show the four type strings.
    ch4: Added print(node_id, power, is_connected) - players see fix result immediately.
         expected_output: 'Origin-01 100 True'
  game.html  - Added #cp-expected-hint, #cp-bugfix-banner HTML elements + CSS

Subscription / Waitlist Gate
  accounts/models.py
    Subscription model: OneToOne → PlayerProfile; plan (monthly/annual); is_active;
      started_at, expires_at; stripe_customer_id, stripe_subscription_id (Phase 2).
    WaitlistEntry model: email (unique), user (FK nullable), created_at.
    PlayerProfile.has_full_access property: True for staff or active subscription.
  accounts/admin.py   - Subscription (activate/deactivate actions), WaitlistEntry registered
  accounts/views.py   - paywall() GET view; waitlist_join() POST (AJAX + form fallback)
  accounts/urls.py    (NEW) - app_name='accounts'; /subscribe/ and /subscribe/waitlist/
  config/urls.py      - path('accounts/', include('accounts.urls')) added
  templates/accounts/paywall.html  (NEW)
    ARIA-themed upgrade page: signal progress bar (14%), 7-region dot grid,
    Monthly ($9.99) and Annual ($59.99 - "Best Value") plan cards,
    AJAX waitlist email capture with confirm/error states.
    All "Buy" buttons show "launching soon" - no Stripe integration yet.
  accounts/migrations/0003_subscription_waitlistentry.py  (NEW)

Freemium gating strategy (implemented):
  Region 1 - always free (no gate check)
  Regions 2-7 - check PlayerProfile.has_full_access; redirect to /subscribe/ if False
  Staff users - bypass subscription check (has_full_access = True for is_staff)
  Stripe Phase 2 - integrate dj-stripe; webhook sets Subscription.is_active = True on payment

---

End of Game Bible v1.0  |  ARIA: The Lost Code
