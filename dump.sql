PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "_prisma_migrations" (
    "id"                    TEXT PRIMARY KEY NOT NULL,
    "checksum"              TEXT NOT NULL,
    "finished_at"           DATETIME,
    "migration_name"        TEXT NOT NULL,
    "logs"                  TEXT,
    "rolled_back_at"        DATETIME,
    "started_at"            DATETIME NOT NULL DEFAULT current_timestamp,
    "applied_steps_count"   INTEGER UNSIGNED NOT NULL DEFAULT 0
);
INSERT INTO _prisma_migrations VALUES('89ba49c8-f2ff-4b30-9af7-b42e513768b0','f211d486a388beb0239348c5c2c14016ee5656921dbaa248c8e6607b1b6dd4fe',1752585368026,'20250715131608_init',NULL,NULL,1752585368025,1);
INSERT INTO _prisma_migrations VALUES('8cb15ca7-7049-46bd-a431-c22bbfb5b99b','530edcef0777461bc26b1ab6d1e55bd934562474e6f3bbfd90b29445d4e1a964',1752597763539,'20250715164243_add_mood_tag_relations',NULL,NULL,1752597763538,1);
INSERT INTO _prisma_migrations VALUES('f58dbb14-55e7-458a-b0f4-f8333b050bbd','3a98e55eac07f7506ce32ec07e08294f21de280e5ee41adda6afbcbcf0d0934d',1752602493065,'20250715180133_add_suggested_game',NULL,NULL,1752602493064,1);
INSERT INTO _prisma_migrations VALUES('206f483e-2a6f-474e-b642-de3371af6a21','f93d0cf57f13aee846920d151dca1c019c1168a7da11f20b3495034d38e8a2fa',1752666532011,'20250716114852_add_game_slug',NULL,NULL,1752666532009,1);
INSERT INTO _prisma_migrations VALUES('f1218a4d-dc13-4652-b562-97ac0c29a8ea','430f17392fd1733c6a71b0ac84ddf8a5885a503597521a78064a4738fef9d40d',1752666897434,'20250716115457_make_slug_required',NULL,NULL,1752666897432,1);
INSERT INTO _prisma_migrations VALUES('4bc7bd52-f0ee-4a18-9c80-74dee0673e9a','2748b24897eebc511eb846a3e5256432a8dcffaa9201ffa99595bb9e13d3b27c',1752669219115,'20250716123339_add_blogpost',NULL,NULL,1752669219113,1);
INSERT INTO _prisma_migrations VALUES('5fbf062b-da7c-40fb-9d1f-7f94e354aee0','015db9ab04b4a8e5b9ad9ae9ae1cdc7bd0f25c569e417c8b1f958dd9e95146ee',1752670802780,'20250716130002_blogtag_separation',NULL,NULL,1752670802779,1);
INSERT INTO _prisma_migrations VALUES('10f5012c-ba93-4fcd-968c-75d789c26aa3','6a76090e165675047c7814c3e3e5854db0c65cacba6857e0ab38b86434534e8b',1752671420657,'20250716131020_blogtag_unique_value',NULL,NULL,1752671420656,1);
CREATE TABLE IF NOT EXISTS "Mood" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "mood" TEXT NOT NULL
);
INSERT INTO Mood VALUES(1,'Relaxed');
INSERT INTO Mood VALUES(2,'Excited');
INSERT INTO Mood VALUES(3,'Focused');
INSERT INTO Mood VALUES(4,'Creative');
INSERT INTO Mood VALUES(5,'Competitive');
INSERT INTO Mood VALUES(6,'Scared');
CREATE TABLE IF NOT EXISTS "Tag" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "value" TEXT NOT NULL,
    "moodId" INTEGER NOT NULL,
    CONSTRAINT "Tag_moodId_fkey" FOREIGN KEY ("moodId") REFERENCES "Mood" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO Tag VALUES(1,'chill',1);
INSERT INTO Tag VALUES(2,'casual',1);
INSERT INTO Tag VALUES(3,'laid-back',1);
INSERT INTO Tag VALUES(4,'action',2);
INSERT INTO Tag VALUES(5,'fast',2);
INSERT INTO Tag VALUES(6,'adrenaline',2);
INSERT INTO Tag VALUES(7,'strategy',3);
INSERT INTO Tag VALUES(8,'puzzle',3);
INSERT INTO Tag VALUES(9,'thinking',3);
INSERT INTO Tag VALUES(10,'sandbox',4);
INSERT INTO Tag VALUES(11,'build',4);
INSERT INTO Tag VALUES(12,'design',4);
INSERT INTO Tag VALUES(13,'multiplayer',5);
INSERT INTO Tag VALUES(14,'ranked',5);
INSERT INTO Tag VALUES(15,'challenge',5);
INSERT INTO Tag VALUES(16,'horror',6);
INSERT INTO Tag VALUES(17,'thriller',6);
INSERT INTO Tag VALUES(18,'dark',6);
CREATE TABLE IF NOT EXISTS "SuggestedGame" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "mood" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO SuggestedGame VALUES(1,'Terraria','Creative','You get to build cool things',1752602581128);
CREATE TABLE IF NOT EXISTS "Game" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "mood" TEXT NOT NULL,
    "image" TEXT,
    "steamUrl" TEXT,
    "popularity" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO Game VALUES(1,'Grand Theft Auto V','grand-theft-auto-v','','Creative','https://media.rawg.io/media/games/20a/20aa03a10cda45239fe22d035c0ebe64.jpg','https://store.steampowered.com/app/3240220/Grand_Theft_Auto_V_Enhanced/',100,1752587073547);
INSERT INTO Game VALUES(2,'The Witcher 3: Wild Hunt','the-witcher-3-wild-hunt','','Scared','https://media.rawg.io/media/games/618/618c2031a07bbff6b4f611f10b6bcdbc.jpg','https://store.steampowered.com/app/292030/The_Witcher_3_Wild_Hunt/',95,1752587073547);
INSERT INTO Game VALUES(3,'Portal 2','portal-2','','Focused','https://media.rawg.io/media/games/2ba/2bac0e87cf45e5b508f227d281c9252a.jpg','http://store.steampowered.com/app/620/',90,1752587073547);
INSERT INTO Game VALUES(4,'Counter-Strike: Global Offensive','counter-strike-global-offensive','','Competitive','https://media.rawg.io/media/games/736/73619bd336c894d6941d926bfd563946.jpg','http://store.steampowered.com/app/730/',98,1752587073547);
INSERT INTO Game VALUES(25,'Middle-earth: Shadow of War','middle-earth-shadow-of-war','','Immersive','https://cdn.cloudflare.steamstatic.com/steam/apps/356190/header.jpg','http://store.steampowered.com/app/356190/',0,1752601587851);
INSERT INTO Game VALUES(28,'Red Dead Redemption 2','red-dead-redemption-2','','Adventurous','https://cdn.cloudflare.steamstatic.com/steam/apps/1174180/header.jpg','https://store.steampowered.com/app/1174180/Red_Dead_Redemption_2/',0,1752601587851);
INSERT INTO Game VALUES(32,'Destiny 2','destiny-2','','Tense','https://cdn.cloudflare.steamstatic.com/steam/apps/1085660/header.jpg','https://store.steampowered.com/app/1085660/',0,1752601587851);
INSERT INTO Game VALUES(39,'Prey','prey','','Tense','https://cdn.cloudflare.steamstatic.com/steam/apps/480490/header.jpg','http://store.steampowered.com/app/480490/',0,1752601587851);
INSERT INTO Game VALUES(41,'Little Nightmares','little-nightmares','','Scared','https://cdn.cloudflare.steamstatic.com/steam/apps/424840/header.jpg','http://store.steampowered.com/app/424840/',0,1752601587851);
INSERT INTO Game VALUES(108,'Mortal Kombat X','mortal-kombat-x','','Competitive','https://cdn.cloudflare.steamstatic.com/steam/apps/307780/header.jpg','http://store.steampowered.com/app/307780/',0,1752601587851);
INSERT INTO Game VALUES(278,'Horizon Zero Dawn','horizon-zero-dawn','','Immersive','https://cdn.cloudflare.steamstatic.com/steam/apps/1151640/header.jpg','https://store.steampowered.com/app/1151640',0,1752601587851);
INSERT INTO Game VALUES(362,'For Honor','for-honor','','Competitive','https://cdn.cloudflare.steamstatic.com/steam/apps/304390/header.jpg','http://store.steampowered.com/app/304390/',0,1752601587851);
INSERT INTO Game VALUES(416,'Grand Theft Auto: San Andreas','grand-theft-auto-san-andreas','','Creative','https://cdn.cloudflare.steamstatic.com/steam/apps/12120/header.jpg','http://store.steampowered.com/app/12120/',0,1752601587851);
INSERT INTO Game VALUES(422,'Terraria','terraria','','Adventurous','https://cdn.cloudflare.steamstatic.com/steam/apps/105600/header.jpg','http://store.steampowered.com/app/105600/',0,1752601587851);
INSERT INTO Game VALUES(430,'Grand Theft Auto: Vice City','grand-theft-auto-vice-city','','Creative','https://cdn.cloudflare.steamstatic.com/steam/apps/12110/header.jpg','http://store.steampowered.com/app/12110/',0,1752601587851);
INSERT INTO Game VALUES(432,'Grand Theft Auto III','grand-theft-auto-iii','','Tense','https://cdn.cloudflare.steamstatic.com/steam/apps/12100/header.jpg','http://store.steampowered.com/app/12100/',0,1752601587851);
INSERT INTO Game VALUES(480,'Resident Evil 7: Biohazard','resident-evil-7-biohazard','','Tense','https://cdn.cloudflare.steamstatic.com/steam/apps/418370/header.jpg','https://store.steampowered.com/app/418370/',0,1752601587851);
INSERT INTO Game VALUES(559,'Fallout Shelter','fallout-shelter','','Creative','https://cdn.cloudflare.steamstatic.com/steam/apps/588430/header.jpg','http://store.steampowered.com/app/588430/',0,1752601587851);
INSERT INTO Game VALUES(613,'Bastion','bastion','','Immersive','https://cdn.cloudflare.steamstatic.com/steam/apps/107100/header.jpg','http://store.steampowered.com/app/107100/',0,1752601587851);
INSERT INTO Game VALUES(654,'Stardew Valley','stardew-valley','','Creative','https://cdn.cloudflare.steamstatic.com/steam/apps/413150/header.jpg','http://store.steampowered.com/app/413150/',0,1752601587851);
INSERT INTO Game VALUES(766,'Warframe','warframe','','Tense','https://cdn.cloudflare.steamstatic.com/steam/apps/230410/header.jpg','http://store.steampowered.com/app/230410/',0,1752601587851);
INSERT INTO Game VALUES(802,'Borderlands 2','borderlands-2','','Tense','https://cdn.cloudflare.steamstatic.com/steam/apps/49520/header.jpg','http://store.steampowered.com/app/49520/',0,1752601587851);
INSERT INTO Game VALUES(864,'Dishonored 2','dishonored-2','','Immersive','https://cdn.cloudflare.steamstatic.com/steam/apps/403640/header.jpg','http://store.steampowered.com/app/403640/',0,1752601587851);
INSERT INTO Game VALUES(906,'Call of Duty: Black Ops III','call-of-duty-black-ops-iii','','Tense','https://cdn.cloudflare.steamstatic.com/steam/apps/311210/header.jpg','http://store.steampowered.com/app/311210/',0,1752601587851);
INSERT INTO Game VALUES(923,'Titanfall 2','titanfall-2','','Excited','https://cdn.cloudflare.steamstatic.com/steam/apps/1237970/header.jpg','https://store.steampowered.com/app/1237970/',0,1752601587851);
INSERT INTO Game VALUES(952,'Shadowrun Returns','shadowrun-returns','','Immersive','https://cdn.cloudflare.steamstatic.com/steam/apps/234650/header.jpg','http://store.steampowered.com/app/234650/',0,1752601587851);
INSERT INTO Game VALUES(998,'Battlefield 1','battlefield-1','','Tense','https://cdn.cloudflare.steamstatic.com/steam/apps/1238840/header.jpg','https://store.steampowered.com/app/1238840/Battlefield_1/',0,1752601587851);
INSERT INTO Game VALUES(1010,'Transistor','transistor','','Immersive','https://cdn.cloudflare.steamstatic.com/steam/apps/237930/header.jpg','http://store.steampowered.com/app/237930/',0,1752601587851);
INSERT INTO Game VALUES(1030,'Limbo','limbo','','Scared','https://cdn.cloudflare.steamstatic.com/steam/apps/48000/header.jpg','http://store.steampowered.com/app/48000/',0,1752601587851);
INSERT INTO Game VALUES(1090,'This War of Mine','this-war-of-mine','','Adventurous','https://cdn.cloudflare.steamstatic.com/steam/apps/282070/header.jpg','http://store.steampowered.com/app/282070/',0,1752601587851);
INSERT INTO Game VALUES(1256,'XCOM 2','xcom-2','','Competitive','https://cdn.cloudflare.steamstatic.com/steam/apps/268500/header.jpg','http://store.steampowered.com/app/268500/',0,1752601587851);
INSERT INTO Game VALUES(1358,'Papers, Please','papers-please','','Focused','https://cdn.cloudflare.steamstatic.com/steam/apps/239030/header.jpg','http://store.steampowered.com/app/239030/',0,1752601587851);
INSERT INTO Game VALUES(1416,'Mafia II','mafia-ii','','Tense','https://cdn.cloudflare.steamstatic.com/steam/apps/50130/header.jpg','http://store.steampowered.com/app/50130/',0,1752601587851);
INSERT INTO Game VALUES(1447,'Deus Ex: Mankind Divided','deus-ex-mankind-divided','','Immersive','https://cdn.cloudflare.steamstatic.com/steam/apps/337000/header.jpg','http://store.steampowered.com/app/337000/',0,1752601587851);
INSERT INTO Game VALUES(1450,'INSIDE','inside','','Scared','https://cdn.cloudflare.steamstatic.com/steam/apps/304430/header.jpg','https://store.steampowered.com/app/304430/INSIDE/',0,1752601587851);
INSERT INTO Game VALUES(1682,'The Wolf Among Us','the-wolf-among-us','','Scared','https://cdn.cloudflare.steamstatic.com/steam/apps/250320/header.jpg','http://store.steampowered.com/app/250320/',0,1752601587851);
INSERT INTO Game VALUES(2093,'No Man''s Sky','no-man-s-sky','','Adventurous','https://cdn.cloudflare.steamstatic.com/steam/apps/275850/header.jpg','http://store.steampowered.com/app/275850/',0,1752601587851);
INSERT INTO Game VALUES(2235,'Batman: Arkham Origins','batman-arkham-origins','','Excited','https://cdn.cloudflare.steamstatic.com/steam/apps/209000/header.jpg','http://store.steampowered.com/app/209000/',0,1752601587851);
INSERT INTO Game VALUES(2361,'Psychonauts','psychonauts','','Adventurous','https://cdn.cloudflare.steamstatic.com/steam/apps/3830/header.jpg','http://store.steampowered.com/app/3830/',0,1752601587851);
INSERT INTO Game VALUES(2454,'DOOM (2016)','doom-2016','','Tense','https://cdn.cloudflare.steamstatic.com/steam/apps/379720/header.jpg','https://store.steampowered.com/app/379720/DOOM/',0,1752601587851);
INSERT INTO Game VALUES(2551,'Dark Souls III','dark-souls-iii','','Scared','https://cdn.cloudflare.steamstatic.com/steam/apps/374320/header.jpg','http://store.steampowered.com/app/374320/',0,1752601587851);
INSERT INTO Game VALUES(2743,'Heavy Rain','heavy-rain','','Immersive','https://cdn.cloudflare.steamstatic.com/steam/apps/960910/header.jpg','https://store.steampowered.com/app/960910/Heavy_Rain/',0,1752601587851);
INSERT INTO Game VALUES(2792,'Layers of Fear','layers-of-fear','','Scared','https://cdn.cloudflare.steamstatic.com/steam/apps/391720/header.jpg','http://store.steampowered.com/app/391720/',0,1752601587851);
INSERT INTO Game VALUES(2819,'Firewatch','firewatch','','Adventurous','https://cdn.cloudflare.steamstatic.com/steam/apps/383870/header.jpg','http://store.steampowered.com/app/383870/',0,1752601587851);
INSERT INTO Game VALUES(3017,'Just Cause 3','just-cause-3','','Adventurous','https://cdn.cloudflare.steamstatic.com/steam/apps/225540/header.jpg','http://store.steampowered.com/app/225540/',0,1752601587851);
INSERT INTO Game VALUES(3070,'Fallout 4','fallout-4','','Immersive','https://cdn.cloudflare.steamstatic.com/steam/apps/377160/header.jpg','http://store.steampowered.com/app/377160/',0,1752601587851);
INSERT INTO Game VALUES(3144,'Super Meat Boy','super-meat-boy','','Lighthearted','https://cdn.cloudflare.steamstatic.com/steam/apps/40800/header.jpg','http://store.steampowered.com/app/40800/',0,1752601587851);
INSERT INTO Game VALUES(3168,'SOMA','soma','','Scared','https://cdn.cloudflare.steamstatic.com/steam/apps/282140/header.jpg','http://store.steampowered.com/app/282140/',0,1752601587851);
INSERT INTO Game VALUES(3191,'Mad Max','mad-max','','Adventurous','https://cdn.cloudflare.steamstatic.com/steam/apps/234140/header.jpg','http://store.steampowered.com/app/234140/',0,1752601587851);
INSERT INTO Game VALUES(3192,'Metal Gear Solid V: The Phantom Pain','metal-gear-solid-v-the-phantom-pain','','Tense','https://cdn.cloudflare.steamstatic.com/steam/apps/287700/header.jpg','http://store.steampowered.com/app/287700/',0,1752601587851);
INSERT INTO Game VALUES(3254,'Journey','journey','','Adventurous','https://cdn.cloudflare.steamstatic.com/steam/apps/638230/header.jpg','https://store.steampowered.com/app/638230/',0,1752601587851);
INSERT INTO Game VALUES(3272,'Rocket League','rocket-league','','Competitive','https://cdn.cloudflare.steamstatic.com/steam/apps/252950/header.jpg','http://store.steampowered.com/app/252950/',0,1752601587851);
INSERT INTO Game VALUES(3287,'Batman: Arkham Knight','batman-arkham-knight','','Scared','https://cdn.cloudflare.steamstatic.com/steam/apps/208650/header.jpg','http://store.steampowered.com/app/208650/',0,1752601587851);
INSERT INTO Game VALUES(3439,'Life is Strange','life-is-strange','','Scared','https://cdn.cloudflare.steamstatic.com/steam/apps/319630/header.jpg','http://store.steampowered.com/app/319630/Life_is_Strange__Episode_1/',0,1752601587851);
INSERT INTO Game VALUES(3474,'Lara Croft and the Temple of Osiris','lara-croft-and-the-temple-of-osiris','','Focused','https://cdn.cloudflare.steamstatic.com/steam/apps/289690/header.jpg','http://store.steampowered.com/app/289690/',0,1752601587851);
INSERT INTO Game VALUES(3497,'Far Cry 4','far-cry-4','','Adventurous','https://cdn.cloudflare.steamstatic.com/steam/apps/298110/header.jpg','http://store.steampowered.com/app/298110/',0,1752601587851);
INSERT INTO Game VALUES(3543,'Borderlands: The Pre-Sequel','borderlands-the-pre-sequel','','Excited','https://cdn.cloudflare.steamstatic.com/steam/apps/261640/header.jpg','http://store.steampowered.com/app/261640/',0,1752601587851);
INSERT INTO Game VALUES(3556,'Alien: Isolation','alien-isolation','','Scared','https://cdn.cloudflare.steamstatic.com/steam/apps/214490/header.jpg','http://store.steampowered.com/app/214490/',0,1752601587851);
INSERT INTO Game VALUES(3603,'Metro 2033 Redux','metro-2033-redux','','Scared','https://cdn.cloudflare.steamstatic.com/steam/apps/286690/header.jpg','http://store.steampowered.com/app/286690/',0,1752601587851);
INSERT INTO Game VALUES(3604,'Metro: Last Light Redux','metro-last-light-redux','','Tense','https://cdn.cloudflare.steamstatic.com/steam/apps/287390/header.jpg','http://store.steampowered.com/app/287390/',0,1752601587851);
INSERT INTO Game VALUES(3612,'Hotline Miami','hotline-miami','','Tense','https://cdn.cloudflare.steamstatic.com/steam/apps/219150/header.jpg','http://store.steampowered.com/app/219150/',0,1752601587851);
INSERT INTO Game VALUES(3678,'War Thunder','war-thunder','','Competitive','https://cdn.cloudflare.steamstatic.com/steam/apps/236390/header.jpg','http://store.steampowered.com/app/236390/',0,1752601587851);
INSERT INTO Game VALUES(3687,'Watch Dogs','watch-dogs','','Adventurous','https://cdn.cloudflare.steamstatic.com/steam/apps/243470/header.jpg','http://store.steampowered.com/app/243470/',0,1752601587851);
INSERT INTO Game VALUES(3696,'Wolfenstein: The New Order','wolfenstein-the-new-order','','Tense','https://cdn.cloudflare.steamstatic.com/steam/apps/201810/header.jpg','http://store.steampowered.com/app/201810/',0,1752601587851);
INSERT INTO Game VALUES(3747,'Metal Gear Solid V: Ground Zeroes','metal-gear-solid-v-ground-zeroes','','Tense','https://cdn.cloudflare.steamstatic.com/steam/apps/311340/header.jpg','http://store.steampowered.com/app/311340/',0,1752601587851);
INSERT INTO Game VALUES(3766,'Thief','thief','','Scared','https://cdn.cloudflare.steamstatic.com/steam/apps/239160/header.jpg','http://store.steampowered.com/app/239160/',0,1752601587851);
INSERT INTO Game VALUES(3790,'Outlast','outlast','','Scared','https://cdn.cloudflare.steamstatic.com/steam/apps/238320/header.jpg','http://store.steampowered.com/app/238320/',0,1752601587851);
INSERT INTO Game VALUES(3841,'Assassin’s Creed IV: Black Flag','assassin-s-creed-iv-black-flag','','Excited','https://cdn.cloudflare.steamstatic.com/steam/apps/242050/header.jpg','http://store.steampowered.com/app/242050/',0,1752601587851);
INSERT INTO Game VALUES(3853,'Trine 2: Complete Story','trine-2-complete-story','','Competitive','https://cdn.cloudflare.steamstatic.com/steam/apps/35720/header.jpg','http://store.steampowered.com/app/35720/',0,1752601587851);
INSERT INTO Game VALUES(3876,'Deus Ex: Human Revolution - Director''s Cut','deus-ex-human-revolution-director-s-cut','','Immersive','https://cdn.cloudflare.steamstatic.com/steam/apps/238010/header.jpg','http://store.steampowered.com/app/238010/',0,1752601587851);
INSERT INTO Game VALUES(3931,'Saints Row IV','saints-row-iv','','Adventurous','https://cdn.cloudflare.steamstatic.com/steam/apps/206420/header.jpg','http://store.steampowered.com/app/206420/',0,1752601587851);
INSERT INTO Game VALUES(3939,'PAYDAY 2','payday-2','','Tense','https://cdn.cloudflare.steamstatic.com/steam/apps/218620/header.jpg','http://store.steampowered.com/app/218620/',0,1752601587851);
INSERT INTO Game VALUES(4003,'GRID 2','grid-2','','Competitive','https://cdn.cloudflare.steamstatic.com/steam/apps/44350/header.jpg','http://store.steampowered.com/app/44350/',0,1752601587851);
INSERT INTO Game VALUES(4013,'Call of Juarez: Gunslinger','call-of-juarez-gunslinger','','Tense','https://cdn.cloudflare.steamstatic.com/steam/apps/204450/header.jpg','http://store.steampowered.com/app/204450/',0,1752601587851);
INSERT INTO Game VALUES(4062,'BioShock Infinite','bioshock-infinite','','Tense','https://cdn.cloudflare.steamstatic.com/steam/apps/8870/header.jpg','http://store.steampowered.com/app/8870/',0,1752601587851);
INSERT INTO Game VALUES(4161,'Far Cry 3','far-cry-3','','Tense','https://cdn.cloudflare.steamstatic.com/steam/apps/220240/header.jpg','http://store.steampowered.com/app/220240/',0,1752601587851);
INSERT INTO Game VALUES(4166,'Mass Effect','mass-effect','','Immersive','https://cdn.cloudflare.steamstatic.com/steam/apps/17460/header.jpg','http://store.steampowered.com/app/17460/',0,1752601587851);
INSERT INTO Game VALUES(4223,'The Darkness II','the-darkness-ii','','Scared','https://cdn.cloudflare.steamstatic.com/steam/apps/67370/header.jpg','http://store.steampowered.com/app/67370/',0,1752601587851);
INSERT INTO Game VALUES(4248,'Dishonored','dishonored','','Immersive','https://cdn.cloudflare.steamstatic.com/steam/apps/205100/header.jpg','http://store.steampowered.com/app/205100/',0,1752601587851);
INSERT INTO Game VALUES(4252,'Mirror''s Edge','mirror-s-edge','','Tense','https://cdn.cloudflare.steamstatic.com/steam/apps/17410/header.jpg','http://store.steampowered.com/app/17410/',0,1752601587851);
INSERT INTO Game VALUES(4280,'Max Payne 3','max-payne-3','','Tense','https://cdn.cloudflare.steamstatic.com/steam/apps/204100/header.jpg','http://store.steampowered.com/app/204100/',0,1752601587851);
INSERT INTO Game VALUES(4286,'BioShock','bioshock','','Tense','https://cdn.cloudflare.steamstatic.com/steam/apps/7670/header.jpg','http://store.steampowered.com/app/7670/',0,1752601587851);
INSERT INTO Game VALUES(4332,'Spec Ops: The Line','spec-ops-the-line','','Tense','https://cdn.cloudflare.steamstatic.com/steam/apps/50300/header.jpg','http://store.steampowered.com/app/50300/',0,1752601587851);
INSERT INTO Game VALUES(4386,'Saints Row: The Third','saints-row-the-third','','Adventurous','https://cdn.cloudflare.steamstatic.com/steam/apps/55230/header.jpg','http://store.steampowered.com/app/55230/',0,1752601587851);
INSERT INTO Game VALUES(4427,'BioShock 2','bioshock-2','','Tense','https://cdn.cloudflare.steamstatic.com/steam/apps/8850/header.jpg','http://store.steampowered.com/app/8850/',0,1752601587851);
INSERT INTO Game VALUES(4459,'Grand Theft Auto IV','grand-theft-auto-iv','','Tense','https://cdn.cloudflare.steamstatic.com/steam/apps/12210/header.jpg','http://store.steampowered.com/app/12210/',0,1752601587851);
INSERT INTO Game VALUES(4502,'Darksiders','darksiders','','Excited','https://cdn.cloudflare.steamstatic.com/steam/apps/50620/header.jpg','http://store.steampowered.com/app/50620/',0,1752601587851);
INSERT INTO Game VALUES(4513,'Just Cause 2','just-cause-2','','Adventurous','https://cdn.cloudflare.steamstatic.com/steam/apps/8190/header.jpg','http://store.steampowered.com/app/8190/',0,1752601587851);
INSERT INTO Game VALUES(4514,'L.A. Noire','l-a-noire','','Adventurous','https://cdn.cloudflare.steamstatic.com/steam/apps/110800/header.jpg','http://store.steampowered.com/app/110800/',0,1752601587851);
INSERT INTO Game VALUES(4527,'Call of Duty: Modern Warfare 2','call-of-duty-modern-warfare-2','','Immersive','https://cdn.cloudflare.steamstatic.com/steam/apps/10180/header.jpg','http://store.steampowered.com/app/10180/',0,1752601587851);
INSERT INTO Game VALUES(4544,'Red Dead Redemption','red-dead-redemption','','Excited','https://cdn.cloudflare.steamstatic.com/steam/apps/2668510/header.jpg','https://store.steampowered.com/app/2668510/Red_Dead_Redemption/',0,1752601587851);
INSERT INTO Game VALUES(4570,'Dead Space (2008)','dead-space-2008','','Scared','https://cdn.cloudflare.steamstatic.com/steam/apps/17470/header.jpg','http://store.steampowered.com/app/17470/',0,1752601587851);
INSERT INTO Game VALUES(4599,'Saints Row 2','saints-row-2','','Tense','https://cdn.cloudflare.steamstatic.com/steam/apps/9480/header.jpg','http://store.steampowered.com/app/9480/',0,1752601587851);
INSERT INTO Game VALUES(4806,'Mass Effect 2','mass-effect-2','','Immersive','https://cdn.cloudflare.steamstatic.com/steam/apps/24980/header.jpg','http://store.steampowered.com/app/24980/',0,1752601587851);
INSERT INTO Game VALUES(4828,'Borderlands','borderlands','','Tense','https://cdn.cloudflare.steamstatic.com/steam/apps/8980/header.jpg','http://store.steampowered.com/app/8980/',0,1752601587851);
INSERT INTO Game VALUES(5286,'Tomb Raider (2013)','tomb-raider-2013','','Excited','https://cdn.cloudflare.steamstatic.com/steam/apps/203160/header.jpg','http://store.steampowered.com/app/203160/',0,1752601587851);
INSERT INTO Game VALUES(5525,'Brutal Legend','brutal-legend','','Excited','https://cdn.cloudflare.steamstatic.com/steam/apps/225260/header.jpg','http://store.steampowered.com/app/225260/',0,1752601587851);
INSERT INTO Game VALUES(5563,'Fallout: New Vegas','fallout-new-vegas','','Immersive','https://cdn.cloudflare.steamstatic.com/steam/apps/22380/header.jpg','http://store.steampowered.com/app/22380/',0,1752601587851);
INSERT INTO Game VALUES(5583,'Hitman: Absolution','hitman-absolution','','Tense','https://cdn.cloudflare.steamstatic.com/steam/apps/203140/header.jpg','http://store.steampowered.com/app/203140/',0,1752601587851);
INSERT INTO Game VALUES(5679,'The Elder Scrolls V: Skyrim','the-elder-scrolls-v-skyrim','','Immersive','https://cdn.cloudflare.steamstatic.com/steam/apps/72850/header.jpg','http://store.steampowered.com/app/72850/',0,1752601587851);
INSERT INTO Game VALUES(7689,'Rise of the Tomb Raider','rise-of-the-tomb-raider','','Adventurous','https://cdn.cloudflare.steamstatic.com/steam/apps/391220/header.jpg','http://store.steampowered.com/app/391220/',0,1752601587851);
INSERT INTO Game VALUES(8488,'Tom Clancy''s Rainbow Six Siege','tom-clancy-s-rainbow-six-siege','','Competitive','https://cdn.cloudflare.steamstatic.com/steam/apps/359550/header.jpg','http://store.steampowered.com/app/359550/',0,1752601587851);
INSERT INTO Game VALUES(9721,'Garry''s Mod','garry-s-mod','','Creative','https://cdn.cloudflare.steamstatic.com/steam/apps/4000/header.jpg','http://store.steampowered.com/app/4000/',0,1752601587851);
INSERT INTO Game VALUES(9743,'Unturned','unturned','','Tense','https://cdn.cloudflare.steamstatic.com/steam/apps/304930/header.jpg','http://store.steampowered.com/app/304930/',0,1752601587851);
INSERT INTO Game VALUES(9767,'Hollow Knight','hollow-knight','','Adventurous','https://cdn.cloudflare.steamstatic.com/steam/apps/367520/header.jpg','http://store.steampowered.com/app/367520/',0,1752601587851);
INSERT INTO Game VALUES(9810,'ARK: Survival Evolved','ark-survival-evolved','','Creative','https://cdn.cloudflare.steamstatic.com/steam/apps/346110/header.jpg','http://store.steampowered.com/app/346110/',0,1752601587851);
INSERT INTO Game VALUES(9830,'Brawlhalla','brawlhalla','','Competitive','https://cdn.cloudflare.steamstatic.com/steam/apps/291550/header.jpg','http://store.steampowered.com/app/291550/',0,1752601587851);
INSERT INTO Game VALUES(9882,'Don''t Starve Together','don-t-starve-together','','Scared','https://cdn.cloudflare.steamstatic.com/steam/apps/322330/header.jpg','http://store.steampowered.com/app/322330/',0,1752601587851);
INSERT INTO Game VALUES(10035,'Hitman','hitman','','Tense','https://cdn.cloudflare.steamstatic.com/steam/apps/236870/header.jpg','http://store.steampowered.com/app/236870/',0,1752601587851);
INSERT INTO Game VALUES(10061,'Watch Dogs 2','watch-dogs-2','','Adventurous','https://cdn.cloudflare.steamstatic.com/steam/apps/447040/header.jpg','http://store.steampowered.com/app/447040/',0,1752601587851);
INSERT INTO Game VALUES(10065,'Cities: Skylines','cities-skylines','','Creative','https://cdn.cloudflare.steamstatic.com/steam/apps/255710/header.jpg','http://store.steampowered.com/app/255710/',0,1752601587851);
INSERT INTO Game VALUES(10073,'Divinity: Original Sin 2','divinity-original-sin-2','','Competitive','https://cdn.cloudflare.steamstatic.com/steam/apps/435150/header.jpg','http://store.steampowered.com/app/435150/',0,1752601587851);
INSERT INTO Game VALUES(10141,'NieR:Automata','nier-automata','','Immersive','https://cdn.cloudflare.steamstatic.com/steam/apps/524220/header.jpg','http://store.steampowered.com/app/524220/',0,1752601587851);
INSERT INTO Game VALUES(10142,'PlayerUnknown’s Battlegrounds','playerunknown-s-battlegrounds','','Competitive','https://cdn.cloudflare.steamstatic.com/steam/apps/578080/header.jpg','http://store.steampowered.com/app/578080/',0,1752601587851);
INSERT INTO Game VALUES(10213,'Dota 2','dota-2','','Competitive','https://cdn.cloudflare.steamstatic.com/steam/apps/570/header.jpg','http://store.steampowered.com/app/570/',0,1752601587851);
INSERT INTO Game VALUES(10243,'Company of Heroes 2','company-of-heroes-2','','Creative','https://cdn.cloudflare.steamstatic.com/steam/apps/231430/header.jpg','http://store.steampowered.com/app/231430/',0,1752601587851);
INSERT INTO Game VALUES(10297,'Sid Meier’s Civilization VI','sid-meier-s-civilization-vi','','Relaxed','https://cdn.cloudflare.steamstatic.com/steam/apps/289070/header.jpg','http://store.steampowered.com/app/289070/',0,1752601587851);
INSERT INTO Game VALUES(10340,'Crusader Kings II','crusader-kings-ii','','Relaxed','https://cdn.cloudflare.steamstatic.com/steam/apps/203770/header.jpg','http://store.steampowered.com/app/203770/',0,1752601587851);
INSERT INTO Game VALUES(10419,'Subnautica','subnautica','','Adventurous','https://cdn.cloudflare.steamstatic.com/steam/apps/264710/header.jpg','http://store.steampowered.com/app/264710/',0,1752601587851);
INSERT INTO Game VALUES(10533,'Path of Exile','path-of-exile','','Competitive','https://cdn.cloudflare.steamstatic.com/steam/apps/238960/header.jpg','http://store.steampowered.com/app/238960/',0,1752601587851);
INSERT INTO Game VALUES(10548,'Darksiders Warmastered Edition','darksiders-warmastered-edition','','Tense','https://cdn.cloudflare.steamstatic.com/steam/apps/462780/header.jpg','http://store.steampowered.com/app/462780/',0,1752601587851);
INSERT INTO Game VALUES(10560,'Total War: SHOGUN 2','total-war-shogun-2','','Relaxed','https://cdn.cloudflare.steamstatic.com/steam/apps/34330/header.jpg','http://store.steampowered.com/app/34330/',0,1752601587851);
INSERT INTO Game VALUES(10754,'BioShock Remastered','bioshock-remastered','','Scared','https://cdn.cloudflare.steamstatic.com/steam/apps/409710/header.jpg','http://store.steampowered.com/app/409710/',0,1752601587851);
INSERT INTO Game VALUES(10989,'Paladins','paladins','','Competitive','https://cdn.cloudflare.steamstatic.com/steam/apps/444090/header.jpg','http://store.steampowered.com/app/444090/',0,1752601587851);
INSERT INTO Game VALUES(11052,'Titan Quest Anniversary Edition','titan-quest-anniversary-edition','','Immersive','https://cdn.cloudflare.steamstatic.com/steam/apps/475150/header.jpg','http://store.steampowered.com/app/475150/',0,1752601587851);
INSERT INTO Game VALUES(11142,'BioShock 2 Remastered','bioshock-2-remastered','','Immersive','https://cdn.cloudflare.steamstatic.com/steam/apps/409720/header.jpg','http://store.steampowered.com/app/409720/',0,1752601587851);
INSERT INTO Game VALUES(11147,'ARK: Survival Of The Fittest','ark-survival-of-the-fittest','','Adventurous','https://cdn.cloudflare.steamstatic.com/steam/apps/407530/header.jpg','http://store.steampowered.com/app/407530/',0,1752601587851);
INSERT INTO Game VALUES(11435,'Viscera Cleanup Detail: Shadow Warrior','viscera-cleanup-detail-shadow-warrior','','Lighthearted','https://cdn.cloudflare.steamstatic.com/steam/apps/255520/header.jpg','http://store.steampowered.com/app/255520/',0,1752601587851);
INSERT INTO Game VALUES(11726,'Dead Cells','dead-cells','','Tense','https://cdn.cloudflare.steamstatic.com/steam/apps/588650/header.jpg','http://store.steampowered.com/app/588650/',0,1752601587851);
INSERT INTO Game VALUES(11859,'Team Fortress 2','team-fortress-2','','Competitive','https://cdn.cloudflare.steamstatic.com/steam/apps/440/header.jpg','http://store.steampowered.com/app/440/',0,1752601587851);
INSERT INTO Game VALUES(11934,'Counter-Strike: Source','counter-strike-source','','Competitive','https://cdn.cloudflare.steamstatic.com/steam/apps/240/header.jpg','http://store.steampowered.com/app/240/',0,1752601587851);
INSERT INTO Game VALUES(11935,'Half-Life Deathmatch: Source','half-life-deathmatch-source','','Tense','https://cdn.cloudflare.steamstatic.com/steam/apps/360/header.jpg','http://store.steampowered.com/app/360/',0,1752601587851);
INSERT INTO Game VALUES(11936,'Half-Life 2: Deathmatch','half-life-2-deathmatch','','Competitive','https://cdn.cloudflare.steamstatic.com/steam/apps/320/header.jpg','http://store.steampowered.com/app/320/',0,1752601587851);
INSERT INTO Game VALUES(11973,'Middle-earth: Shadow of Mordor','middle-earth-shadow-of-mordor','','Immersive','https://cdn.cloudflare.steamstatic.com/steam/apps/241930/header.jpg','https://store.steampowered.com/app/241930/Middleearth_Shadow_of_Mordor/',0,1752601587851);
INSERT INTO Game VALUES(12020,'Left 4 Dead 2','left-4-dead-2','','Tense','https://cdn.cloudflare.steamstatic.com/steam/apps/550/header.jpg','http://store.steampowered.com/app/550/',0,1752601587851);
INSERT INTO Game VALUES(12024,'Insurgency','insurgency','','Competitive','https://cdn.cloudflare.steamstatic.com/steam/apps/222880/header.jpg','http://store.steampowered.com/app/222880/',0,1752601587851);
INSERT INTO Game VALUES(12447,'The Elder Scrolls V: Skyrim Special Edition','the-elder-scrolls-v-skyrim-special-edition','','Immersive','https://cdn.cloudflare.steamstatic.com/steam/apps/489830/header.jpg','http://store.steampowered.com/app/489830/',0,1752601587851);
INSERT INTO Game VALUES(12536,'Hellblade: Senua''s Sacrifice','hellblade-senua-s-sacrifice','','Scared','https://cdn.cloudflare.steamstatic.com/steam/apps/414340/header.jpg','https://store.steampowered.com/app/414340/',0,1752601587851);
INSERT INTO Game VALUES(13268,'Amnesia: A Machine for Pigs','amnesia-a-machine-for-pigs','','Scared','https://cdn.cloudflare.steamstatic.com/steam/apps/239200/header.jpg','http://store.steampowered.com/app/239200/',0,1752601587851);
INSERT INTO Game VALUES(13305,'Assassin’s Creed III','assassin-s-creed-iii','','Excited','https://cdn.cloudflare.steamstatic.com/steam/apps/208480/header.jpg','http://store.steampowered.com/app/208480/',0,1752601587851);
INSERT INTO Game VALUES(13461,'Resident Evil 5','resident-evil-5','','Tense','https://cdn.cloudflare.steamstatic.com/steam/apps/21690/header.jpg','http://store.steampowered.com/app/21690/',0,1752601587851);
INSERT INTO Game VALUES(13535,'Left 4 Dead','left-4-dead','','Tense','https://cdn.cloudflare.steamstatic.com/steam/apps/500/header.jpg','http://store.steampowered.com/app/500/',0,1752601587851);
INSERT INTO Game VALUES(13536,'Portal','portal','','Tense','https://cdn.cloudflare.steamstatic.com/steam/apps/400/header.jpg','http://store.steampowered.com/app/400/',0,1752601587851);
INSERT INTO Game VALUES(13537,'Half-Life 2','half-life-2','','Tense','https://cdn.cloudflare.steamstatic.com/steam/apps/220/header.jpg','http://store.steampowered.com/app/220/',0,1752601587851);
INSERT INTO Game VALUES(13554,'Fallout','fallout','','Adventurous','https://cdn.cloudflare.steamstatic.com/steam/apps/38400/header.jpg','http://store.steampowered.com/app/38400/',0,1752601587851);
INSERT INTO Game VALUES(13627,'Undertale','undertale','','Scared','https://cdn.cloudflare.steamstatic.com/steam/apps/391540/header.jpg','http://store.steampowered.com/app/391540/',0,1752601587851);
INSERT INTO Game VALUES(13633,'Sid Meier''s Civilization V','sid-meier-s-civilization-v','','Relaxed','https://cdn.cloudflare.steamstatic.com/steam/apps/8930/header.jpg','http://store.steampowered.com/app/8930/',0,1752601587851);
INSERT INTO Game VALUES(13668,'Amnesia: The Dark Descent','amnesia-the-dark-descent','','Scared','https://cdn.cloudflare.steamstatic.com/steam/apps/57300/header.jpg','http://store.steampowered.com/app/57300/',0,1752601587851);
INSERT INTO Game VALUES(13910,'XCOM: Enemy Unknown','xcom-enemy-unknown','','Competitive','https://cdn.cloudflare.steamstatic.com/steam/apps/200510/header.jpg','http://store.steampowered.com/app/200510/',0,1752601587851);
INSERT INTO Game VALUES(15002,'The Stanley Parable','the-stanley-parable','','Adventurous','https://cdn.cloudflare.steamstatic.com/steam/apps/221910/header.jpg','http://store.steampowered.com/app/221910/',0,1752601587851);
INSERT INTO Game VALUES(16944,'The Witcher 2: Assassins of Kings Enhanced Edition','the-witcher-2-assassins-of-kings-enhanced-edition','','Scared','https://cdn.cloudflare.steamstatic.com/steam/apps/20920/header.jpg','http://store.steampowered.com/app/20920/',0,1752601587851);
INSERT INTO Game VALUES(17352,'Killing Floor','killing-floor','','Scared','https://cdn.cloudflare.steamstatic.com/steam/apps/1250/header.jpg','http://store.steampowered.com/app/1250/',0,1752601587851);
INSERT INTO Game VALUES(17540,'Injustice: Gods Among Us Ultimate Edition','injustice-gods-among-us-ultimate-edition','','Competitive','https://cdn.cloudflare.steamstatic.com/steam/apps/242700/header.jpg','http://store.steampowered.com/app/242700/',0,1752601587851);
INSERT INTO Game VALUES(17572,'Batman: Arkham Asylum Game of the Year Edition','batman-arkham-asylum-game-of-the-year-edition','','Adventurous','https://cdn.cloudflare.steamstatic.com/steam/apps/35140/header.jpg','http://store.steampowered.com/app/35140/',0,1752601587851);
INSERT INTO Game VALUES(17576,'Batman: Arkham City - Game of the Year Edition','batman-arkham-city-game-of-the-year-edition','','Adventurous','https://cdn.cloudflare.steamstatic.com/steam/apps/200260/header.jpg','http://store.steampowered.com/app/200260/',0,1752601587851);
INSERT INTO Game VALUES(17822,'The Witcher: Enhanced Edition Director''s Cut','the-witcher-enhanced-edition-director-s-cut','','Immersive','https://cdn.cloudflare.steamstatic.com/steam/apps/20900/header.jpg','http://store.steampowered.com/app/20900/',0,1752601587851);
INSERT INTO Game VALUES(17959,'Ori and the Blind Forest: Definitive Edition','ori-and-the-blind-forest-definitive-edition','','Adventurous','https://cdn.cloudflare.steamstatic.com/steam/apps/387290/header.jpg','http://store.steampowered.com/app/387290/',0,1752601587851);
INSERT INTO Game VALUES(18080,'Half-Life','half-life','','Tense','https://cdn.cloudflare.steamstatic.com/steam/apps/70/header.jpg','http://store.steampowered.com/app/70/',0,1752601587851);
INSERT INTO Game VALUES(18240,'Brothers: A Tale of Two Sons','brothers-a-tale-of-two-sons','','Focused','https://cdn.cloudflare.steamstatic.com/steam/apps/225080/header.jpg','http://store.steampowered.com/app/225080/',0,1752601587851);
INSERT INTO Game VALUES(18272,'Magicka','magicka','','Competitive','https://cdn.cloudflare.steamstatic.com/steam/apps/42910/header.jpg','http://store.steampowered.com/app/42910/',0,1752601587851);
INSERT INTO Game VALUES(18613,'Counter-Strike: Condition Zero','counter-strike-condition-zero','','Competitive','https://cdn.cloudflare.steamstatic.com/steam/apps/80/header.jpg','http://store.steampowered.com/app/80/',0,1752601587851);
INSERT INTO Game VALUES(19103,'Half-Life 2: Lost Coast','half-life-2-lost-coast','','Competitive','https://cdn.cloudflare.steamstatic.com/steam/apps/340/header.jpg','http://store.steampowered.com/app/340/',0,1752601587851);
INSERT INTO Game VALUES(19301,'Counter-Strike','counter-strike','','Competitive','https://cdn.cloudflare.steamstatic.com/steam/apps/10/header.jpg','http://store.steampowered.com/app/10/',0,1752601587851);
INSERT INTO Game VALUES(19487,'Alan Wake','alan-wake','','Tense','https://cdn.cloudflare.steamstatic.com/steam/apps/108710/header.jpg','http://store.steampowered.com/app/108710/',0,1752601587851);
INSERT INTO Game VALUES(19590,'Ori and the Blind Forest','ori-and-the-blind-forest','','Adventurous','https://cdn.cloudflare.steamstatic.com/steam/apps/261570/header.jpg','http://store.steampowered.com/app/261570/',0,1752601587851);
INSERT INTO Game VALUES(19709,'Half-Life 2: Episode Two','half-life-2-episode-two','','Tense','https://cdn.cloudflare.steamstatic.com/steam/apps/420/header.jpg','http://store.steampowered.com/app/420/',0,1752601587851);
INSERT INTO Game VALUES(19710,'Half-Life 2: Episode One','half-life-2-episode-one','','Tense','https://cdn.cloudflare.steamstatic.com/steam/apps/380/header.jpg','http://store.steampowered.com/app/380/',0,1752601587851);
INSERT INTO Game VALUES(22571,'Black Desert Online','black-desert-online','','Relaxed','https://cdn.cloudflare.steamstatic.com/steam/apps/582660/header.jpg','http://store.steampowered.com/app/582660/',0,1752601587851);
INSERT INTO Game VALUES(23027,'The Walking Dead: Season 1','the-walking-dead-season-1','','Tense','https://cdn.cloudflare.steamstatic.com/steam/apps/207610/header.jpg','http://store.steampowered.com/app/207610/',0,1752601587851);
INSERT INTO Game VALUES(23585,'Far Cry 5','far-cry-5','','Excited','https://cdn.cloudflare.steamstatic.com/steam/apps/552520/header.jpg','http://store.steampowered.com/app/552520/',0,1752601587851);
INSERT INTO Game VALUES(28153,'Assassin''s Creed Origins','assassin-s-creed-origins','','Immersive','https://cdn.cloudflare.steamstatic.com/steam/apps/582160/header.jpg','http://store.steampowered.com/app/582160/',0,1752601587851);
INSERT INTO Game VALUES(28154,'Cuphead','cuphead','','Lighthearted','https://cdn.cloudflare.steamstatic.com/steam/apps/268910/header.jpg','http://store.steampowered.com/app/268910/',0,1752601587851);
INSERT INTO Game VALUES(28172,'Kingdom Come: Deliverance','kingdom-come-deliverance','','Immersive','https://cdn.cloudflare.steamstatic.com/steam/apps/379430/header.jpg','http://store.steampowered.com/app/379430/',0,1752601587851);
INSERT INTO Game VALUES(28179,'SEGA Mega Drive and Genesis Classics','sega-mega-drive-and-genesis-classics','','Adventurous','https://cdn.cloudflare.steamstatic.com/steam/apps/34270/header.jpg','http://store.steampowered.com/app/34270/',0,1752601587851);
INSERT INTO Game VALUES(28201,'Metro Exodus','metro-exodus','','Tense','https://cdn.cloudflare.steamstatic.com/steam/apps/412020/header.jpg','http://store.steampowered.com/app/412020/',0,1752601587851);
INSERT INTO Game VALUES(28202,'Wolfenstein II: The New Colossus','wolfenstein-ii-the-new-colossus','','Tense','https://cdn.cloudflare.steamstatic.com/steam/apps/650500/header.jpg','http://store.steampowered.com/app/650500/',0,1752601587851);
INSERT INTO Game VALUES(28568,'Assassin''s Creed II','assassin-s-creed-ii','','Tense','https://cdn.cloudflare.steamstatic.com/steam/apps/33230/header.jpg','https://store.steampowered.com/app/33230/Assassins_Creed_2_Deluxe_Edition/',0,1752601587851);
INSERT INTO Game VALUES(29028,'Metro 2033','metro-2033','','Scared','https://cdn.cloudflare.steamstatic.com/steam/apps/43110/header.jpg','https://store.steampowered.com/app/43110/',0,1752601587851);
INSERT INTO Game VALUES(29177,'Detroit: Become Human','detroit-become-human','','Adventurous','https://cdn.cloudflare.steamstatic.com/steam/apps/1222140/header.jpg','https://store.steampowered.com/app/1222140',0,1752601587851);
INSERT INTO Game VALUES(41494,'Cyberpunk 2077','cyberpunk-2077','','Excited','https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/header.jpg','https://store.steampowered.com/app/1091500/',0,1752601587851);
INSERT INTO Game VALUES(43877,'Quake Champions','quake-champions','','Tense','https://cdn.cloudflare.steamstatic.com/steam/apps/611500/header.jpg','http://store.steampowered.com/app/611500/',0,1752601587851);
INSERT INTO Game VALUES(45969,'Warhammer: Vermintide 2','warhammer-vermintide-2','','Tense','https://cdn.cloudflare.steamstatic.com/steam/apps/552500/header.jpg','http://store.steampowered.com/app/552500/',0,1752601587851);
INSERT INTO Game VALUES(46889,'Monster Hunter: World','monster-hunter-world','','Adventurous','https://cdn.cloudflare.steamstatic.com/steam/apps/582010/header.jpg','https://store.steampowered.com/app/582010/',0,1752601587851);
INSERT INTO Game VALUES(50734,'Sekiro: Shadows Die Twice','sekiro-shadows-die-twice','','Scared','https://cdn.cloudflare.steamstatic.com/steam/apps/814380/header.jpg','https://store.steampowered.com/app/814380/',0,1752601587851);
INSERT INTO Game VALUES(50738,'Death Stranding','death-stranding','','Adventurous','https://cdn.cloudflare.steamstatic.com/steam/apps/1190460/header.jpg','https://store.steampowered.com/app/1190460/Death_Stranding/?cc=ru',0,1752601587851);
INSERT INTO Game VALUES(51329,'Shadow of the Tomb Raider','shadow-of-the-tomb-raider','','Adventurous','https://cdn.cloudflare.steamstatic.com/steam/apps/750920/header.jpg','https://store.steampowered.com/app/750920/',0,1752601587851);
INSERT INTO Game VALUES(58134,'Marvel''s Spider-Man','marvel-s-spider-man','','Adventurous','https://cdn.cloudflare.steamstatic.com/steam/apps/1817070/header.jpg','https://store.steampowered.com/app/1817070/Marvels_SpiderMan_Remastered/',0,1752601587851);
INSERT INTO Game VALUES(58175,'God of War (2018)','god-of-war-2018','','Excited','https://cdn.cloudflare.steamstatic.com/steam/apps/1593500/header.jpg','https://store.steampowered.com/app/1593500/God_of_War/',0,1752601587851);
INSERT INTO Game VALUES(58616,'Assassin''s Creed Odyssey','assassin-s-creed-odyssey','','Immersive','https://cdn.cloudflare.steamstatic.com/steam/apps/812140/header.jpg','https://store.steampowered.com/app/812140/',0,1752601587851);
INSERT INTO Game VALUES(58654,'Hitman 2','hitman-2','','Tense','https://cdn.cloudflare.steamstatic.com/steam/apps/863550/header.jpg','https://store.steampowered.com/app/863550/',0,1752601587851);
INSERT INTO Game VALUES(58751,'Halo Infinite','halo-infinite','','Excited','https://cdn.cloudflare.steamstatic.com/steam/apps/1240440/header.jpg','https://store.steampowered.com/app/1240440',0,1752601587851);
INSERT INTO Game VALUES(58777,'DOOM Eternal','doom-eternal','','Tense','https://cdn.cloudflare.steamstatic.com/steam/apps/782330/header.jpg','https://store.steampowered.com/app/782330/',0,1752601587851);
INSERT INTO Game VALUES(58812,'Control','control','','Excited','https://cdn.cloudflare.steamstatic.com/steam/apps/870780/header.jpg','https://store.steampowered.com/app/870780/',0,1752601587851);
INSERT INTO Game VALUES(257201,'Star Wars Jedi: Fallen Order','star-wars-jedi-fallen-order','','Adventurous','https://cdn.cloudflare.steamstatic.com/steam/apps/1172380/header.jpg','https://store.steampowered.com/app/1172380',0,1752601587851);
INSERT INTO Game VALUES(262382,'Disco Elysium','disco-elysium','','Immersive','https://cdn.cloudflare.steamstatic.com/steam/apps/632470/header.jpg','https://store.steampowered.com/app/632470/Disco_Elysium/',0,1752601587851);
INSERT INTO Game VALUES(274755,'Hades','hades','','Excited','https://cdn.cloudflare.steamstatic.com/steam/apps/1145360/header.jpg','https://store.steampowered.com/app/1145360/',0,1752601587851);
INSERT INTO Game VALUES(290856,'Apex Legends','apex-legends','','Tense','https://cdn.cloudflare.steamstatic.com/steam/apps/1172470/header.jpg','https://store.steampowered.com/app/1172470',0,1752601587851);
INSERT INTO Game VALUES(326243,'Elden Ring','elden-ring','','Scared','https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/header.jpg','https://store.steampowered.com/app/1245620',0,1752601587851);
INSERT INTO Game VALUES(326292,'Fall Guys: Ultimate Knockout','fall-guys-ultimate-knockout','','Competitive','https://cdn.cloudflare.steamstatic.com/steam/apps/1097150/header.jpg','https://store.steampowered.com/app/1097150/Fall_Guys_Ultimate_Knockout/',0,1752601587851);
INSERT INTO Game VALUES(356714,'Among Us','among-us','','Competitive','https://cdn.cloudflare.steamstatic.com/steam/apps/945360/header.jpg','https://store.steampowered.com/app/945360/',0,1752601587851);
CREATE TABLE IF NOT EXISTS "BlogPost" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "excerpt" TEXT NOT NULL,
    "image" TEXT,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO BlogPost VALUES(1,'Why Mood-Based Game Discovery Works','why-mood-based-game-discovery-works',1752105600000,'Explore how matching games to your mood can help you find the perfect experience every time you play.','https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',replace('[Check out Stardew Valley](/games/stardew-valley) Mood-based game discovery is a new way to find games that match how you feel. Instead of searching by genre or popularity, you can discover titles that fit your current mood—whether you want to relax, get excited, or just have fun.\n\nThis approach helps players find hidden gems and enjoy gaming experiences that truly resonate with them. Try it out on MoodPlay 2!','\n',char(10)),1752669560036);
INSERT INTO BlogPost VALUES(2,'Top 5 Relaxing Steam Games for 2025','top-5-relaxing-steam-games-2025',1751328000000,'Unwind with these calming titles that are perfect for a chill evening or a stress-free weekend.','https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80',replace('Looking to unwind? Here are our top 5 relaxing Steam games for 2025:\n\n1. Stardew Valley\n2. Spiritfarer\n3. Dorfromantik\n4. Unpacking\n5. A Short Hike\n\nEach of these games offers a peaceful, stress-free experience.','\n',char(10)),1752669560036);
INSERT INTO BlogPost VALUES(3,'How to Suggest a Game on MoodPlay','how-to-suggest-a-game-on-moodplay',1750377600000,'A quick guide to sharing your favorite games with the MoodPlay community.','https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80','Want to see your favorite game on MoodPlay? Just use the Suggest feature on our site! Fill in the game details and why you think it fits a certain mood. Our team will review your suggestion and add it if it fits.',1752669560036);
CREATE TABLE IF NOT EXISTS "BlogTag" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "value" TEXT NOT NULL
);
INSERT INTO BlogTag VALUES(1,'Relaxed');
CREATE TABLE IF NOT EXISTS "_BlogPostToBlogTag" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_BlogPostToBlogTag_A_fkey" FOREIGN KEY ("A") REFERENCES "BlogPost" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_BlogPostToBlogTag_B_fkey" FOREIGN KEY ("B") REFERENCES "BlogTag" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO _BlogPostToBlogTag VALUES(1,1);
DELETE FROM sqlite_sequence;
INSERT INTO sqlite_sequence VALUES('Mood',6);
INSERT INTO sqlite_sequence VALUES('Tag',18);
INSERT INTO sqlite_sequence VALUES('SuggestedGame',1);
INSERT INTO sqlite_sequence VALUES('Game',356714);
INSERT INTO sqlite_sequence VALUES('BlogPost',3);
INSERT INTO sqlite_sequence VALUES('BlogTag',1);
CREATE UNIQUE INDEX "Game_slug_key" ON "Game"("slug");
CREATE UNIQUE INDEX "BlogPost_slug_key" ON "BlogPost"("slug");
CREATE UNIQUE INDEX "_BlogPostToBlogTag_AB_unique" ON "_BlogPostToBlogTag"("A", "B");
CREATE INDEX "_BlogPostToBlogTag_B_index" ON "_BlogPostToBlogTag"("B");
CREATE UNIQUE INDEX "BlogTag_value_key" ON "BlogTag"("value");
COMMIT;
