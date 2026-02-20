--
-- PostgreSQL database dump
--

\restrict YDFVqtLukfug0gWvcrY9Nl29jJl4qHjKVPhg31eYmfOySxnVISpKpgxk3rlRwMr

-- Dumped from database version 17.6 (Debian 17.6-0+deb13u1)
-- Dumped by pg_dump version 17.6 (Debian 17.6-0+deb13u1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: app; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA app;


--
-- Name: postgis; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS postgis WITH SCHEMA public;


--
-- Name: EXTENSION postgis; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION postgis IS 'PostGIS geometry and geography spatial types and functions';


--
-- Name: pgrouting; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgrouting WITH SCHEMA public;


--
-- Name: EXTENSION pgrouting; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pgrouting IS 'pgRouting Extension';


--
-- Name: outdoor_node_kind; Type: TYPE; Schema: app; Owner: -
--

CREATE TYPE app.outdoor_node_kind AS ENUM (
    'road',
    'path',
    'entrance'
);


--
-- Name: node_kind; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.node_kind AS ENUM (
    'hall',
    'room',
    'stair',
    'elevator',
    'door',
    'other',
    'entrance'
);


--
-- Name: get_shortest_path(integer, integer); Type: FUNCTION; Schema: app; Owner: -
--

CREATE FUNCTION app.get_shortest_path(start_node integer, end_node integer) RETURNS TABLE(seq integer, path_seq integer, node integer, edge integer, cost double precision, agg_cost double precision)
    LANGUAGE sql
    AS $$
    SELECT
        seq,
        path_seq,
        node,
        edge,
        cost,
        agg_cost
    FROM pgr_dijkstra(
        'SELECT
            edge_id  AS id,
            src      AS source,
            dst      AS target,
            distance AS cost,
            distance AS reverse_cost
         FROM app.edges',
        start_node,
        end_node,
        directed := false
    );
$$;


--
-- Name: nearest_entrance_for_room(double precision, double precision, text); Type: FUNCTION; Schema: app; Owner: -
--

CREATE FUNCTION app.nearest_entrance_for_room(p_lat double precision, p_lon double precision, p_room_code text) RETURNS TABLE(entrance_node_id integer, distance_m double precision)
    LANGUAGE sql STABLE
    AS $$
WITH dest_building AS (
  SELECT substring(f.code, 1, 5) AS bldg_code
  FROM app.nodes n
  JOIN app.floors f ON f.floor_id = n.floor_id
  WHERE n.room_code = p_room_code
  LIMIT 1
),
user_pt AS (
  SELECT ST_SetSRID(ST_MakePoint(p_lon, p_lat), 4326)::geography AS g
)
SELECT
  ba.entrance_node_id,
  ST_Distance(ba.user_gps::geography, up.g) AS distance_m
FROM dest_building db
JOIN app.building_anchor ba
  ON TRUE
JOIN app.nodes en
  ON en.node_id = ba.entrance_node_id
JOIN app.floors f2
  ON f2.floor_id = en.floor_id
CROSS JOIN user_pt up
WHERE en.kind = 'entrance'
  AND substring(f2.code, 1, 5) = db.bldg_code
ORDER BY ST_Distance(ba.user_gps::geography, up.g)
LIMIT 1;
$$;


--
-- Name: upsert_building(text, text, integer); Type: PROCEDURE; Schema: app; Owner: -
--

CREATE PROCEDURE app.upsert_building(IN p_code text, IN p_name text, IN p_building_id integer DEFAULT NULL::integer)
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- If caller provides building_id and it exists, update it
    IF p_building_id IS NOT NULL THEN
        UPDATE app.buildings
        SET code = p_code,
            name = p_name
        WHERE building_id = p_building_id;

        IF FOUND THEN
            RETURN;
        END IF;
    END IF;

    -- Otherwise upsert by code
    INSERT INTO app.buildings (code, name)
    VALUES (p_code, p_name)
    ON CONFLICT (code)
    DO UPDATE SET name = EXCLUDED.name;
END;
$$;


--
-- Name: upsert_floor(text, text, integer); Type: PROCEDURE; Schema: app; Owner: -
--

CREATE PROCEDURE app.upsert_floor(IN p_code text, IN p_name text, IN p_floor_id integer DEFAULT NULL::integer)
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- If caller provides a floor_id and it exists, update it
    IF p_floor_id IS NOT NULL THEN
        UPDATE app.floors
        SET code = p_code,
            name = p_name
        WHERE floor_id = p_floor_id;

        IF FOUND THEN
            RETURN;
        END IF;
    END IF;

    -- Otherwise upsert by code
    INSERT INTO app.floors (code, name)
    VALUES (p_code, p_name)
    ON CONFLICT (code)
    DO UPDATE SET name = EXCLUDED.name;
END;
$$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: building_anchor; Type: TABLE; Schema: app; Owner: -
--

CREATE TABLE app.building_anchor (
    entrance_node_id integer NOT NULL,
    user_gps public.geometry(Point,4326) NOT NULL
);


--
-- Name: buildings; Type: TABLE; Schema: app; Owner: -
--

CREATE TABLE app.buildings (
    building_id integer NOT NULL,
    code text NOT NULL,
    name text NOT NULL
);


--
-- Name: buildings_building_id_seq; Type: SEQUENCE; Schema: app; Owner: -
--

CREATE SEQUENCE app.buildings_building_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: buildings_building_id_seq; Type: SEQUENCE OWNED BY; Schema: app; Owner: -
--

ALTER SEQUENCE app.buildings_building_id_seq OWNED BY app.buildings.building_id;


--
-- Name: edges; Type: TABLE; Schema: app; Owner: -
--

CREATE TABLE app.edges (
    edge_id integer NOT NULL,
    src integer NOT NULL,
    dst integer NOT NULL,
    geom public.geometry(LineString,4326) NOT NULL,
    is_accessible boolean DEFAULT false NOT NULL,
    distance double precision GENERATED ALWAYS AS (public.st_length((geom)::public.geography)) STORED
);


--
-- Name: edges_edge_id_seq; Type: SEQUENCE; Schema: app; Owner: -
--

CREATE SEQUENCE app.edges_edge_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: edges_edge_id_seq; Type: SEQUENCE OWNED BY; Schema: app; Owner: -
--

ALTER SEQUENCE app.edges_edge_id_seq OWNED BY app.edges.edge_id;


--
-- Name: edges_outdoor; Type: TABLE; Schema: app; Owner: -
--

CREATE TABLE app.edges_outdoor (
    edge_id integer NOT NULL,
    source integer,
    target integer,
    cost double precision NOT NULL,
    geom public.geometry(LineString,4326) NOT NULL
);


--
-- Name: edges_outdoor_edge_id_seq; Type: SEQUENCE; Schema: app; Owner: -
--

CREATE SEQUENCE app.edges_outdoor_edge_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: edges_outdoor_edge_id_seq; Type: SEQUENCE OWNED BY; Schema: app; Owner: -
--

ALTER SEQUENCE app.edges_outdoor_edge_id_seq OWNED BY app.edges_outdoor.edge_id;


--
-- Name: floors; Type: TABLE; Schema: app; Owner: -
--

CREATE TABLE app.floors (
    floor_id integer NOT NULL,
    code text NOT NULL,
    name text NOT NULL
);


--
-- Name: floors_floor_id_seq; Type: SEQUENCE; Schema: app; Owner: -
--

CREATE SEQUENCE app.floors_floor_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: floors_floor_id_seq; Type: SEQUENCE OWNED BY; Schema: app; Owner: -
--

ALTER SEQUENCE app.floors_floor_id_seq OWNED BY app.floors.floor_id;


--
-- Name: nodes; Type: TABLE; Schema: app; Owner: -
--

CREATE TABLE app.nodes (
    node_id integer NOT NULL,
    floor_id integer DEFAULT 1 NOT NULL,
    kind public.node_kind NOT NULL,
    room_name text,
    geom public.geometry(Point,4326) NOT NULL,
    is_accessible boolean DEFAULT true NOT NULL,
    connector_id text,
    room_code text,
    CONSTRAINT nodes_check CHECK (((kind <> 'stair'::public.node_kind) OR (is_accessible = false)))
);


--
-- Name: nodes_node_id_seq; Type: SEQUENCE; Schema: app; Owner: -
--

CREATE SEQUENCE app.nodes_node_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: nodes_node_id_seq; Type: SEQUENCE OWNED BY; Schema: app; Owner: -
--

ALTER SEQUENCE app.nodes_node_id_seq OWNED BY app.nodes.node_id;


--
-- Name: nodes_outdoor; Type: TABLE; Schema: app; Owner: -
--

CREATE TABLE app.nodes_outdoor (
    node_id integer NOT NULL,
    kind app.outdoor_node_kind NOT NULL,
    geom public.geometry(Point,4326) NOT NULL,
    is_accessible boolean DEFAULT true NOT NULL,
    connector_id text,
    CONSTRAINT nodes_outdoor_geom_srid_chk CHECK ((public.st_srid(geom) = 4326)),
    CONSTRAINT nodes_outdoor_geom_type_chk CHECK (((public.geometrytype(geom) = 'POINT'::text) OR (public.geometrytype(geom) = 'ST_Point'::text)))
);


--
-- Name: nodes_outdoor_node_id_seq; Type: SEQUENCE; Schema: app; Owner: -
--

CREATE SEQUENCE app.nodes_outdoor_node_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: nodes_outdoor_node_id_seq; Type: SEQUENCE OWNED BY; Schema: app; Owner: -
--

ALTER SEQUENCE app.nodes_outdoor_node_id_seq OWNED BY app.nodes_outdoor.node_id;


--
-- Name: edges_routing; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.edges_routing AS
 SELECT edge_id AS id,
    src AS source,
    dst AS target,
    distance AS cost,
    distance AS reverse_cost
   FROM app.edges;


--
-- Name: buildings building_id; Type: DEFAULT; Schema: app; Owner: -
--

ALTER TABLE ONLY app.buildings ALTER COLUMN building_id SET DEFAULT nextval('app.buildings_building_id_seq'::regclass);


--
-- Name: edges edge_id; Type: DEFAULT; Schema: app; Owner: -
--

ALTER TABLE ONLY app.edges ALTER COLUMN edge_id SET DEFAULT nextval('app.edges_edge_id_seq'::regclass);


--
-- Name: edges_outdoor edge_id; Type: DEFAULT; Schema: app; Owner: -
--

ALTER TABLE ONLY app.edges_outdoor ALTER COLUMN edge_id SET DEFAULT nextval('app.edges_outdoor_edge_id_seq'::regclass);


--
-- Name: floors floor_id; Type: DEFAULT; Schema: app; Owner: -
--

ALTER TABLE ONLY app.floors ALTER COLUMN floor_id SET DEFAULT nextval('app.floors_floor_id_seq'::regclass);


--
-- Name: nodes node_id; Type: DEFAULT; Schema: app; Owner: -
--

ALTER TABLE ONLY app.nodes ALTER COLUMN node_id SET DEFAULT nextval('app.nodes_node_id_seq'::regclass);


--
-- Name: nodes_outdoor node_id; Type: DEFAULT; Schema: app; Owner: -
--

ALTER TABLE ONLY app.nodes_outdoor ALTER COLUMN node_id SET DEFAULT nextval('app.nodes_outdoor_node_id_seq'::regclass);


--
-- Name: building_anchor building_anchor_pkey; Type: CONSTRAINT; Schema: app; Owner: -
--

ALTER TABLE ONLY app.building_anchor
    ADD CONSTRAINT building_anchor_pkey PRIMARY KEY (entrance_node_id);


--
-- Name: buildings buildings_code_key; Type: CONSTRAINT; Schema: app; Owner: -
--

ALTER TABLE ONLY app.buildings
    ADD CONSTRAINT buildings_code_key UNIQUE (code);


--
-- Name: buildings buildings_pkey; Type: CONSTRAINT; Schema: app; Owner: -
--

ALTER TABLE ONLY app.buildings
    ADD CONSTRAINT buildings_pkey PRIMARY KEY (building_id);


--
-- Name: edges_outdoor edges_outdoor_pkey; Type: CONSTRAINT; Schema: app; Owner: -
--

ALTER TABLE ONLY app.edges_outdoor
    ADD CONSTRAINT edges_outdoor_pkey PRIMARY KEY (edge_id);


--
-- Name: edges edges_pkey; Type: CONSTRAINT; Schema: app; Owner: -
--

ALTER TABLE ONLY app.edges
    ADD CONSTRAINT edges_pkey PRIMARY KEY (edge_id);


--
-- Name: floors floors_code_key; Type: CONSTRAINT; Schema: app; Owner: -
--

ALTER TABLE ONLY app.floors
    ADD CONSTRAINT floors_code_key UNIQUE (code);


--
-- Name: floors floors_code_uk; Type: CONSTRAINT; Schema: app; Owner: -
--

ALTER TABLE ONLY app.floors
    ADD CONSTRAINT floors_code_uk UNIQUE (code);


--
-- Name: floors floors_pkey; Type: CONSTRAINT; Schema: app; Owner: -
--

ALTER TABLE ONLY app.floors
    ADD CONSTRAINT floors_pkey PRIMARY KEY (floor_id);


--
-- Name: nodes_outdoor nodes_outdoor_pkey; Type: CONSTRAINT; Schema: app; Owner: -
--

ALTER TABLE ONLY app.nodes_outdoor
    ADD CONSTRAINT nodes_outdoor_pkey PRIMARY KEY (node_id);


--
-- Name: nodes nodes_pkey; Type: CONSTRAINT; Schema: app; Owner: -
--

ALTER TABLE ONLY app.nodes
    ADD CONSTRAINT nodes_pkey PRIMARY KEY (node_id);


--
-- Name: edges_outdoor_geom_gix; Type: INDEX; Schema: app; Owner: -
--

CREATE INDEX edges_outdoor_geom_gix ON app.edges_outdoor USING gist (geom);


--
-- Name: edges_outdoor_target_idx; Type: INDEX; Schema: app; Owner: -
--

CREATE INDEX edges_outdoor_target_idx ON app.edges_outdoor USING btree (target);


--
-- Name: idx_nodes_room_code; Type: INDEX; Schema: app; Owner: -
--

CREATE INDEX idx_nodes_room_code ON app.nodes USING btree (room_code);


--
-- Name: nodes_outdoor_geom_gix; Type: INDEX; Schema: app; Owner: -
--

CREATE INDEX nodes_outdoor_geom_gix ON app.nodes_outdoor USING gist (geom);


--
-- Name: nodes_outdoor_kind_idx; Type: INDEX; Schema: app; Owner: -
--

CREATE INDEX nodes_outdoor_kind_idx ON app.nodes_outdoor USING btree (kind);


--
-- Name: building_anchor building_anchor_entrance_node_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: -
--

ALTER TABLE ONLY app.building_anchor
    ADD CONSTRAINT building_anchor_entrance_node_id_fkey FOREIGN KEY (entrance_node_id) REFERENCES app.nodes(node_id);


--
-- Name: edges edges_dst_fkey; Type: FK CONSTRAINT; Schema: app; Owner: -
--

ALTER TABLE ONLY app.edges
    ADD CONSTRAINT edges_dst_fkey FOREIGN KEY (dst) REFERENCES app.nodes(node_id) ON DELETE CASCADE;


--
-- Name: edges_outdoor edges_outdoor_source_fkey; Type: FK CONSTRAINT; Schema: app; Owner: -
--

ALTER TABLE ONLY app.edges_outdoor
    ADD CONSTRAINT edges_outdoor_source_fkey FOREIGN KEY (source) REFERENCES app.nodes_outdoor(node_id);


--
-- Name: edges_outdoor edges_outdoor_target_fkey; Type: FK CONSTRAINT; Schema: app; Owner: -
--

ALTER TABLE ONLY app.edges_outdoor
    ADD CONSTRAINT edges_outdoor_target_fkey FOREIGN KEY (target) REFERENCES app.nodes_outdoor(node_id);


--
-- Name: edges edges_src_fkey; Type: FK CONSTRAINT; Schema: app; Owner: -
--

ALTER TABLE ONLY app.edges
    ADD CONSTRAINT edges_src_fkey FOREIGN KEY (src) REFERENCES app.nodes(node_id) ON DELETE CASCADE;


--
-- Name: nodes nodes_floor_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: -
--

ALTER TABLE ONLY app.nodes
    ADD CONSTRAINT nodes_floor_id_fkey FOREIGN KEY (floor_id) REFERENCES app.floors(floor_id) ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

\unrestrict YDFVqtLukfug0gWvcrY9Nl29jJl4qHjKVPhg31eYmfOySxnVISpKpgxk3rlRwMr

