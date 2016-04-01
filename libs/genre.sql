   SELECT type FROM Genre 
   JOIN Genre_Tvshow
   ON Genre.id=Genre_Tvshow.id_genre
   JOIN Tvshow
   ON tvshow.id=Genre_Tvshow.id_show WHERE Tvshow.id=?;
