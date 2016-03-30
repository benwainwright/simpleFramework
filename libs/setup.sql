   DROP TABLE IF EXISTS User;
   DROP TABLE IF EXISTS Movie;
   DROP TABLE IF EXISTS Tvshow;
   DROP TABLE IF EXISTS Image;
   DROP TABLE IF EXISTS Video;
   DROP TABLE IF EXISTS Episode;
   DROP TABLE IF EXISTS Season;
   DROP TABLE IF EXISTS Person;
   DROP TABLE IF EXISTS Genre;
   DROP TABLE IF EXISTS Genre_Tvshow;
   DROP TABLE IF EXISTS Genre_Movie;
   DROP TABLE IF EXISTS Tvshow_User_Interested;
   DROP TABLE IF EXISTS Movie_User_Interested;
   DROP TABLE IF EXISTS Tvshow_Season;
   DROP TABLE IF EXISTS Season_Episode;
   DROP TABLE IF EXISTS Favorite_Episode;
   DROP TABLE IF EXISTS Favorite_Movie;
   DROP TABLE IF EXISTS Seen_Episode;
   DROP TABLE IF EXISTS Seen_Movie;
   DROP TABLE IF EXISTS Image_Movie;
   DROP TABLE IF EXISTS Image_Tvshow;
   DROP TABLE IF EXISTS Video_Movie;
   DROP TABLE IF EXISTS Video_Tvshow;
   DROP TABLE IF EXISTS Person_Movie_Director;
   DROP TABLE IF EXISTS Person_Movie_Actor;

   CREATE TABLE User (
      id INT PRIMARY KEY NOT NULL,
      name VARCHAR(40) NOT NULL,
      surname VARCHAR(40) NOT NULL,
      email VARCHAR(80) UNIQUE NOT NULL,
      city VARCHAR(20) NOT NULL,
      age INT NOT NULL,
      username VARCHAR(100) NOT NULL,
      password VARCHAR(40) NOT NULL,__ hashed of course
      salt  VARCHAR(40) NOT NULL
      CHECK(age >= 12),
      CHECK(age<=100)
   );

   CREATE TABLE Tvshow (
      id INT PRIMARY KEY NOT NULL,
      title VARCHAR(40) NOT NULL,
      status INT NOT NULL,
      started VARCHAR(20) NOT NULL,
      synopsis VARCHAR(80) NOT NULL
   );

   CREATE TABLE Movie (
      id INT PRIMARY KEY NOT NULL,
      title VARCHAR(40) NOT NULL,
      aired_date DATE NOT NULL,
      description VARCHAR(80) NOT NULL
   );

   CREATE TABLE Genre (
      id INT PRIMARY KEY NOT NULL,
      type VARCHAR(40) NOT NULL
   );


   CREATE TABLE Person (
      id INT PRIMARY KEY NOT NULL,
      name VARCHAR(40) NOT NULL,
      surname VARCHAR(40) NOT NULL
   );

   CREATE TABLE Image (
      id INT PRIMARY KEY NOT NULL,
      title VARCHAR(20) NOT NULL,
      caption VARCHAR(40) NOT NULL,
      url VARCHAR(80) NOT NULL
   );

   CREATE TABLE Video (
      id INT PRIMARY KEY NOT NULL,
      title VARCHAR(20) NOT NULL,
      caption VARCHAR(40) NOT NULL,
      url VARCHAR(80) NOT NULL
   );

   CREATE TABLE Season (
      id INT PRIMARY KEY NOT NULL,
      title VARCHAR(20) NOT NULL,
      description VARCHAR(40) NOT NULL,
      num VARCHAR(80) NOT NULL
   );

   CREATE TABLE Episode (
      id INT PRIMARY KEY NOT NULL,
      title VARCHAR(20) NOT NULL,
      description VARCHAR(40) NOT NULL,
      num VARCHAR(80) NOT NULL
   );

   CREATE TABLE Genre_Movie (
      id_genre INT NOT NULL,
      id_movie INT NOT NULL,
      CONSTRAINT genreID FOREIGN KEY (id_genre) REFERENCES Genre(id),
      CONSTRAINT movieID FOREIGN KEY (id_movie) REFERENCES Movie(id),
      PRIMARY KEY(id_movie, id_genre)
   );

   CREATE TABLE Genre_TVshow (
      id_genre INT NOT NULL,
      id_show INT NOT NULL,
      CONSTRAINT genreID FOREIGN KEY (id_genre) REFERENCES Genre(id),
      CONSTRAINT showID FOREIGN KEY (id_show) REFERENCES Tvshow(id),
      PRIMARY KEY(id_show, id_genre)
   );

   CREATE TABLE Tvshow_User_Interested (
      id_user INT NOT NULL,
      id_show INT NOT NULL,
      CONSTRAINT userID FOREIGN KEY (id_user) REFERENCES User(id),
      CONSTRAINT showID FOREIGN KEY (id_show) REFERENCES Tvshow(id),
      PRIMARY KEY(id_show, id_user)
   );

   CREATE TABLE Movie_User_Interested (
      id_user INT NOT NULL,
      id_movie INT NOT NULL,
      CONSTRAINT userID FOREIGN KEY (id_user) REFERENCES User(id),
      CONSTRAINT movieID FOREIGN KEY (id_movie) REFERENCES Movie(id),
      PRIMARY KEY(id_movie, id_user)
   );

   CREATE TABLE Tvshow_Season (
      id_show INT NOT NULL,
      id_season INT NOT NULL,
      CONSTRAINT showID FOREIGN KEY (id_show) REFERENCES Tvshow(id),
      CONSTRAINT seasonID FOREIGN KEY (id_season) REFERENCES Season(id),
      PRIMARY KEY(id_show, id_season)
   );

   CREATE TABLE Season_Episode (
      id_season INT NOT NULL,
      id_episode INT NOT NULL,
      CONSTRAINT episodeID FOREIGN KEY (id_episode) REFERENCES Episode(id),
      CONSTRAINT seasonID FOREIGN KEY (id_season) REFERENCES Season(id),
      PRIMARY KEY(id_episode, id_season)
   );

   CREATE TABLE Seen_Episode (
      id INT PRIMARY KEY NOT NULL,
      id_episode INT NOT NULL,
      CONSTRAINT episodeID FOREIGN KEY (id_episode) REFERENCES Episode(id)
   );

   CREATE TABLE Favorite_Episode (
      id INT PRIMARY KEY NOT NULL,
      id_episode INT NOT NULL,
      CONSTRAINT episodeID FOREIGN KEY (id_episode) REFERENCES Episode(id)
   );

   CREATE TABLE Favorite_Movie (
      id INT PRIMARY KEY NOT NULL,
      id_movie INT NOT NULL,
      CONSTRAINT movieID FOREIGN KEY (id_movie) REFERENCES Movie(id)
   );

   CREATE TABLE Seen_Movie (
      id INT PRIMARY KEY NOT NULL,
      id_movie INT NOT NULL,
      CONSTRAINT movieID FOREIGN KEY (id_movie) REFERENCES Movie(id)
   );

   CREATE TABLE Person_Movie_Actor (
      id_person INT NOT NULL,
      id_movie INT NOT NULL,
      CONSTRAINT movieID FOREIGN KEY (id_movie) REFERENCES Movie(id),
      CONSTRAINT personID FOREIGN KEY (id_person) REFERENCES Person(id),
      PRIMARY KEY(id_person, id_movie)
   );

   CREATE TABLE Person_Movie_Director (
      id_person INT NOT NULL,
      id_movie INT NOT NULL,
      CONSTRAINT movieID FOREIGN KEY (id_movie) REFERENCES Movie(id),
      CONSTRAINT personID FOREIGN KEY (id_person) REFERENCES Person(id),
      PRIMARY KEY(id_person, id_movie)
   );

   CREATE TABLE Image_Movie (
      id_image INT NOT NULL,
      id_movie INT NOT NULL,
      CONSTRAINT movieID FOREIGN KEY (id_movie) REFERENCES Movie(id),
      CONSTRAINT imageID FOREIGN KEY (id_image) REFERENCES Image(id),
      PRIMARY KEY(id_image, id_movie)
   );

   CREATE TABLE Video_Movie (
      id_video INT NOT NULL,
      id_movie INT NOT NULL,
      CONSTRAINT movieID FOREIGN KEY (id_movie) REFERENCES Movie(id),
      CONSTRAINT videoID FOREIGN KEY (id_video) REFERENCES Video(id),
      PRIMARY KEY(id_video, id_movie)
   );

   CREATE TABLE Video_Tvshow (
      id_video INT NOT NULL,
      id_show INT NOT NULL,
      CONSTRAINT showID FOREIGN KEY (id_show) REFERENCES Tvshow(id),
      CONSTRAINT videoID FOREIGN KEY (id_video) REFERENCES Video(id),
      PRIMARY KEY(id_video, id_show)
   );

   CREATE TABLE Image_Tvshow (
      id_image INT NOT NULL,
      id_show INT NOT NULL,
      CONSTRAINT showID FOREIGN KEY (id_show) REFERENCES Tvshow(id),
      CONSTRAINT imageID FOREIGN KEY (id_image) REFERENCES Image(id),
      PRIMARY KEY(id_image, id_show)
   );
