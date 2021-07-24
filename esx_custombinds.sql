USE es_extended;

CREATE TABLE player_binds (
  owner varchar(60) NOT NULL DEFAULT '0',
  binds longtext DEFAULT NULL
);