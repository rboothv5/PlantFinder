CREATE USER docker;

\c template1

DROP DATABASE IF EXISTS plantfinder;
CREATE DATABASE plantfinder
   WITH
   OWNER = postgres
   ENCODING = 'UTF8'
   TABLESPACE = pg_default
   CONNECTION LIMIT = -1;

GRANT ALL PRIVILEGES ON DATABASE plantfinder TO docker;

\c plantfinder

CREATE TABLE IF NOT EXISTS public.identifications
(
    id bigint NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 100000000 CACHE 1 ),
    identificationsid integer NOT NULL,
    filename character varying(50) COLLATE pg_catalog."default" NULL,
    identifiedplant character varying(50) COLLATE pg_catalog."default" NULL,
    description character varying(1000) COLLATE pg_catalog."default" NULL,
    allidentifiedplants character varying(100) COLLATE pg_catalog."default" NULL,
    score numeric(5,2) NULL,
    CONSTRAINT identifications_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.identifications
    OWNER to postgres;

CREATE TABLE IF NOT EXISTS public.imageinformation
(
    id bigint NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 100000000 CACHE 1 ),
    identificationsid integer NOT NULL,
    filename character varying(50) COLLATE pg_catalog."default" NULL,
    imagedate timestamp without time zone NULL,
    dateadded timestamp without time zone NULL,
    latitude numeric(15,10) NULL,
    longitude numeric(15,10) NULL,
    CONSTRAINT imageinformation_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.imageinformation
    OWNER to postgres;


CREATE TABLE IF NOT EXISTS public.userinformation
(
    id bigint NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 100000000 CACHE 1 ),
    identificationsid integer NOT NULL,
    filename character varying(50) COLLATE pg_catalog."default" NOT NULL,
    firstname character varying(50) COLLATE pg_catalog."default" NOT NULL,
    surname character varying(50) COLLATE pg_catalog."default" NOT NULL,
    comments character varying(1000) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT userinformation_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.userinformation
    OWNER to postgres;    

CREATE TABLE IF NOT EXISTS public.sampleimages
(
    id bigint NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 100000000 CACHE 1 ),
    position integer NOT NULL,
    filename character varying(50) COLLATE pg_catalog."default" NULL,
    plantname character varying(50) COLLATE pg_catalog."default" NULL,
    CONSTRAINT sampleimages_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.sampleimages
    OWNER to postgres;    

TRUNCATE table sampleimages;
INSERT INTO public.sampleimages(
	position, filename, plantname)
	VALUES 
(1,'AfricanDaisy1.jpg','African Daisy'),
(1,'Conifer1.jpg','Conifer'),
(1,'Hydrangea1.jpg','Hydrangea'),

(2,'Gaura1.jpg','Gaura'),
(2,'LovePalm1.jpg','Love Palm'),
(2,'Petunia1.jpg','Petunia'),

(3,'AfricanDaisy2.jpg','African Daisy'),
(3,'Conifer2.jpg','Conifer'),
(3,'Hydrangea2.jpg','Hydrangea'),

(4,'Gaura2.jpg','Gaura'),
(4,'LovePalm2.jpg','Love Palm'),
(4,'Petunia2.jpg','Petunia'),

(5,'AfricanDaisy3.jpg','African Daisy'),
(5,'Conifer3.jpg','Conifer'),
(5,'Hydrangea3.jpg','Hydrangea'),

(6,'Gaura3.jpg','Gaura'),
(6,'LovePalm3.jpg','Love Palm'),
(6,'Petunia3.jpg','Petunia'),

(7,'LovePalm4.jpg','Love Palm'),
(7,'AfricanDaisy4.jpg','African Daisy'),
(7,'Conifer4.jpg','Conifer'),

(8,'Hydrangea4.jpg','Hydrangea'),
(8,'Gaura4.jpg','Gaura'),
(8,'Petunia4.jpg','Petunia');

CREATE OR REPLACE FUNCTION public.getallidentifications(
	)
    RETURNS TABLE(identifiedplant character varying, description character varying, allidentifiedplants character varying, score numeric, imagedate timestamp without time zone, latitude numeric, longitude numeric, dateadded timestamp without time zone, filename character varying) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
begin

	CREATE TEMPORARY TABLE IdentificationsDetail(
    	IdentifiedPlant VARCHAR(50),
    	Description VARCHAR(1000),
		AllIdentifiedPlants VARCHAR(50),
    	Score numeric(5,2),
    	ImageDate timestamp without time zone,
    	Latitude numeric(15,10),
    	Longitude numeric(15,10),
    	DateAdded timestamp without time zone,
		Filename VARCHAR(50)
	);
  
 	INSERT INTO IdentificationsDetail( 
		IdentifiedPlant,
    	Description,
		AllIdentifiedPlants,
    	Score,
    	ImageDate,
    	Latitude,
    	Longitude,
    	DateAdded,
		Filename
	) 
 	SELECT 
  		ident.identifiedplant,
  		ident.description,
		ident.allidentifiedplants,
		ident.score,
		imginfo.imagedate, 
		imginfo.latitude, 
		imginfo.longitude,
		imginfo.dateadded, 
		imginfo.filename 
  	FROM public.identifications ident 
	INNER JOIN public.imageinformation imginfo 
	ON ident.identificationsid=imginfo.identificationsid 
	AND ident.filename=imginfo.filename 
	ORDER BY imginfo.dateadded DESC, score DESC;
  
 	RETURN query
  
	SELECT 	
  		idtemp.IdentifiedPlant,
    	idtemp.description,
		idtemp.AllIdentifiedPlants,
    	idtemp.Score,
    	idtemp.ImageDate,
    	idtemp.Latitude,
    	idtemp.Longitude,
    	idtemp.DateAdded,
		idtemp.Filename
	FROM IdentificationsDetail idtemp;
   
   DROP TABLE IdentificationsDetail;
   
end;
$BODY$;

ALTER FUNCTION public.getallidentifications()
    OWNER TO postgres;
	
CREATE OR REPLACE FUNCTION public.getidentificationssummary(
	)
    RETURNS TABLE(firstname character varying, surname character varying, filename character varying, identifiedplant character varying, score numeric, dateadded timestamp without time zone, comments character varying) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
begin

	CREATE TEMPORARY TABLE IdentificationsSummary(
    	Firstname varchar(50), 
		Surname varchar(50), 
		Filename varchar(50), 
		IdentifiedPlant varchar(50), 
		Score numeric(5,2), 
		DateAdded timestamp without time zone, 
		Comments varchar(1000)
	);
  
 	INSERT INTO IdentificationsSummary( 
		Firstname, 
		Surname, 
		Filename, 
		IdentifiedPlant, 
		Score, 
		DateAdded, 
		Comments
	) 
 	SELECT 
		userinfo.firstname, 
		userinfo.surname, 
		ident.filename, 
		ident.identifiedplant,  
		MAX(CAST(ident.score AS FLOAT)) AS score, 
		imginfo.dateadded, 	
		userinfo.comments 
	FROM public.identifications ident 
	INNER JOIN public.imageinformation imginfo 
	ON ident.identificationsid=imginfo.identificationsid 
	AND ident.filename=imginfo.filename 
	INNER JOIN public.userinformation userinfo 
	ON ident.identificationsid=userinfo.identificationsid 
	AND ident.filename=userinfo.filename 
	GROUP BY 
		userinfo.firstname, 
		userinfo.surname, 
		ident.filename, 
		ident.identifiedplant, 
		imginfo.dateadded, 
		userinfo.comments  
	ORDER BY imginfo.dateadded DESC;
  
 	RETURN query
  
	SELECT 	
  		istemp.Firstname, 
		istemp.Surname, 
		istemp.Filename, 
		istemp.IdentifiedPlant, 
		istemp.Score, 
		istemp.DateAdded, 
		istemp.Comments
	FROM IdentificationsSummary istemp;
	
	DROP TABLE IdentificationsSummary;
   
end;
$BODY$;

ALTER FUNCTION public.getidentificationssummary()
    OWNER TO postgres;

CREATE OR REPLACE FUNCTION public.getrecentidentifications(
	)
    RETURNS TABLE(identifiedplant character varying, filename character varying, score numeric, dateadded timestamp without time zone) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
begin

	CREATE TEMPORARY TABLE RecentIdentificationsTemp(
    	IdentifiedPlant varchar(50),
		Filename varchar(50),
		Score numeric(5,2), 
		DateAdded timestamp without time zone
	);
  
 	INSERT INTO RecentIdentificationsTemp( 
		IdentifiedPlant,
		Filename,
		Score, 
		DateAdded
	) 
 	SELECT 
		ident.identifiedplant,
		ident.filename, 
		MAX(CAST(ident.score AS FLOAT)) AS score, 
		imginfo.dateadded 
	FROM public.identifications ident 
	INNER JOIN public.imageinformation imginfo 
	ON ident.identificationsid=imginfo.identificationsid 
	AND ident.filename=imginfo.filename 
	GROUP BY 
		ident.identifiedplant, 
		ident.filename, 
		imginfo.dateadded 
	ORDER BY imginfo.dateadded DESC LIMIT 3;
  
 	RETURN query
  
	SELECT 	
  		ritemp.IdentifiedPlant,
		ritemp.Filename,
		ritemp.Score, 
		ritemp.DateAdded
	FROM RecentIdentificationsTemp ritemp;
   
   DROP TABLE RecentIdentificationsTemp;
   
END;
$BODY$;

ALTER FUNCTION public.getrecentidentifications()
    OWNER TO postgres;	
	
CREATE OR REPLACE FUNCTION public.sampleimagelist(
	)
    RETURNS TABLE(indexposition integer, filename character varying, plantname character varying) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
begin

  CREATE TEMPORARY TABLE SampleImagesList(
	  IndexPosition int,
	  Filename varchar(50), 
	  Plantname varchar(50)
  );
	
	INSERT INTO SampleImagesList(
		IndexPosition, 
	  	Filename, 
	  	Plantname
  	) 
  	(SELECT si.position, si.filename,si.plantname FROM sampleimages si WHERE Position=1 ORDER BY random() LIMIT 1) 	
  	UNION	
  	(SELECT si.position, si.filename,si.plantname FROM sampleimages si WHERE Position=2 ORDER BY random() LIMIT 1) 
  	UNION	
  	(SELECT si.position, si.filename,si.plantname FROM sampleimages si WHERE Position=3 ORDER BY random() LIMIT 1) 
  	UNION	
  	(SELECT si.position, si.filename,si.plantname FROM sampleimages si WHERE Position=4 ORDER BY random() LIMIT 1)
	UNION
	(SELECT si.position, si.filename,si.plantname FROM sampleimages si WHERE Position=5 ORDER BY random() LIMIT 1) 	
  	UNION	
  	(SELECT si.position, si.filename,si.plantname FROM sampleimages si WHERE Position=6 ORDER BY random() LIMIT 1) 
  	UNION	
  	(SELECT si.position, si.filename,si.plantname FROM sampleimages si WHERE Position=7 ORDER BY random() LIMIT 1) 
  	UNION	
  	(SELECT si.position, si.filename,si.plantname FROM sampleimages si WHERE Position=8 ORDER BY random() LIMIT 1);
  
	RETURN query
  
 	SELECT 
  		sil.IndexPosition, 
		sil.Filename, 
		sil.Plantname 
	FROM Sampleimageslist sil;
  
  DROP TABLE SampleImagesList;
  
END;
$BODY$;

ALTER FUNCTION public.sampleimagelist()
    OWNER TO postgres;
