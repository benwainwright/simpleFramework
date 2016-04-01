   SELECT DISTINCT Tvshow.title, Tvshow.synopsis, Tvshow.status,
      Tvshow.started, Image.url AS img, Video.url AS vid,
      (SELECT count(*) AS episodes
      FROM (SELECT * FROM Episode
      JOIN Season_Episode
      ON Season_Episode.id_episode=Episode.id
      JOIN season
      ON season.id= Season_Episode.id_season
      JOIN Tvshow_Season
      ON Tvshow_Season.id_season=Season_Episode.id_season
      WHERE Tvshow_Season.id_show=?)) AS episodes,
      (SELECT count(*) AS seasons
      FROM (SELECT * FROM season
      JOIN Tvshow_Season
      ON Tvshow_Season.id_season=Season.id
      WHERE Tvshow_Season.id_show=?)) AS seasons
      FROM Tvshow
      LEFT JOIN Tvshow_Season
      ON Tvshow.id=Tvshow_Season.id_show
      LEFT JOIN Season
      ON Season.id=Tvshow_Season.id_season
      LEFT JOIN Season_Episode
      ON Season_Episode.id_season=Season.id
      LEFT JOIN Episode
      ON Season_Episode.id_episode=Episode.id
      LEFT JOIN Image_Tvshow
      ON Image_Tvshow.id_show=Tvshow.id
      LEFT JOIN Image
      ON Image_Tvshow.id_image=Image.id
      LEFT JOIN Video_Tvshow
      ON Video_Tvshow.id_show=Tvshow.id
      LEFT JOIN Video
      ON Video_Tvshow.id_video=Video.id
      WHERE Tvshow.id=?;
