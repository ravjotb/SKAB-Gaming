# SKAB-Gaming

With the pandemic, people are looking for better ways to connect online more than ever. We believe one of the best ways to connect with others in an online environment is through video games. However, there is a lot of difficulty in trying to play a video game with others. Not all consoles are compatible with each other, and some games only work on PCs and not Macs. 

Based on our discussion as a group, it seems that most of our members are not very proficient in web development so we are aiming to pick a project that would be reasonable for our skill levels. We hope that our choice will be challenging enough for everyone to be able to participate and expand their web development knowledge, but not too challenging to be overwhelming.

For this project, our group has chosen to implement a quiz based video game that is accessed through a browser on the web. Anybody with a phone or computer connected to the internet will be able to play. In a sense, our game would be similar to the popular platform Kahoot in that a host creates a game with questions, while people join and then enter their answers. Based on how many questions you get correct you get points. While our game is designed for entertainment purposes, it can be adapted to be utilized by teachers in an online learning environment to better help students learn at home. Below you can find the list of features that we are planning to integrate into the game. This list may change over the course of the project depending on difficulty, time frame, and expectations for our group.


## Core features of the game:
* Register and login users
    - Regular user and admin
    - Add a forgot password feature
    - To implement this we would require the password package from Node and possibly the SendGrid API for resetting password

* Create a profile for each user
    - This would include profile picture and other information
    - Profile picture could be uploaded using cloudinary api and the multer package from node
    - Display lifetime stats and awards for the user

* Select from pre-made games or host creates the game
    - Chooses category and inputs questions and answers
    - Decides between written and multiple choice and time for questions 
    - Public or private and limits the number of players

* Users can join that specific game
    - Either enter a code for a private room
    - See a list of public games that a user can join

* Receive user inputs
    - Text 
    - User clicks on box corresponding to the answer
* Output score based on correct answers
    - Show a list of users with the highest score for that specific game
* Create a leaderboard so a user could see where they rank based on their competition
    - Leaderboard may be filtered based on region or type of game/category
* Add a chat functionality for each specific instance of a game 
    - Would be running simultaneously with the game
    - May decide to add private messaging 
    - This function could be implemented with the help of the socket.io package


### Database models that we may need for this implementation include:
  - User, Question, Room, Preset_Game, Question_Choices, User_Question_Answer. For the sake of simplicity we will not specify attributes in the proposal.
	
Once the core of the game is implemented we will look to add a store where users can purchase microtransactions for the game. This store will be available at all times, so if a user is stuck on a question they can buy a hint or additional help. We will be implementing security features so that any payment data entered is encrypted and secure. For our purposes we will not accept real credit cards, but will instead use credits as the in-game currency so that all the features can be used and tested.

The current game outlined is mostly text-based. Time permitting we may implement additional features such as a graphical portion to the game where users control a small character on the screen and can move it around by clicking,tapping, or keyboard input. The goal of users would be to reach the button in the middle as quickly as possible in order to be the one to answer the given question first (similar to the buzzer in Jeopardy). Obstacles can be added to slow down users navigating to the button, which would force them to find the optimal path and add a layer of complexity to the game. Microtransactions could further be implemented with this concept to gain power-ups or apply power downs to other players.
