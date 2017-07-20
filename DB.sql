create table memberinfo (
id INT AUTO_INCREMENT,
account VARCHAR(50),
pwd VARCHAR(50),
photo longblob,
newpicname VARCHAR(50),
oldpicname VARCHAR(50),
PRIMARY KEY (id) );

INSERT INTO memberinfo (id,account,pwd,photo,newpicname,oldpicname)VALUES (NULL, 'aaa@gamil.com', '111', NULL, NULL,NULL); 

