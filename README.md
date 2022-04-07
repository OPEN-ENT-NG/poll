# À propos de l'application Sondages

* Licence : [AGPL v3](http://www.gnu.org/licenses/agpl.txt) - Copyright Région Hauts-de-France (ex Picardie), Département de l'Essonne, Région Nouvelle Aquitaine (ex Poitou-Charentes)
* Développeur(s) : ATOS
* Financeur(s) : Région Hauts-de-France (ex Picardie), Département de l'Essonne, Région Nouvelle Aquitaine (ex Poitou-Charentes)
* Description : Application d'administration et de diffusion de sondages simples. L'application permet de collecter les réponses aux sondages et d'afficher les résultats sous forme de graphique.

# Documentation technique

## Construction

<pre>
		gradle copyMod
</pre>

## Déployer dans ent-core


## Configuration

Dans le fichier `/poll/deployment/poll/conf.json.template` :

Déclarer l'application dans la liste :
<pre>
  {
   "name": "net.atos~poll~0.2.0",
      "config": {
        "main" : "net.atos.entng.poll.Poll",
        "port" : 8070,
        "app-name" : "Poll",
        "app-address" : "/poll",
        "app-icon" : "poll-large",
        "host": "${host}",
        "ssl" : $ssl,
        "userbook-host": "${host}",
        "integration-mode" : "HTTP",
        "app-registry.port" : 8012,
        "mode" : "${mode}",
        "entcore.port" : 8009
      }
  }
</pre>

Associer une route d'entée à la configuration du module proxy intégré (`"name": "net.atos~poll~0.2.0"`) :
<pre>
	{
		"location": "/poll",
		"proxy_pass": "http://localhost:8070"
	}
</pre>

# Présentation du module

## Fonctionnalités

Sondage permet de créer une question à laquelle les utilisateurs sélectionnés peuvent répondre, en choisissant une réponse dans la liste proposée.

Des permissions sur les différentes actions possibles sur les sondages, dont la contribution et la gestion, sont configurées dans sondage (via des partages Ent-core).
Le droit de lecture, correspondant à qui peut consulter le sondage est également configuré de cette manière.

Sondage met en œuvre un comportement de recherche sur les questions.

## Modèle de persistance

Les données du module sont stockées dans une collection Mongo :
 - "poll" : pour toutes les données propres aux sondages

## Modèle serveur

Le module serveur utilise un contrôleur de déclaration :

* `PollController` : Point d'entrée à l'application, Routage des vues, sécurité globale et déclaration de l'ensemble des comportements relatifs aux sondages (liste, création, modification, destruction, vote et partage)

Le contrôleur étend les classes du framework Ent-core exploitant les CrudServices de base.

Le module serveur met en œuvre deux évènements issus du framework Ent-core :

* `PollRepositoryEvents` : Logique de changement d'année scolaire
* `PollSearchingEvents` : Logique de recherche

Un jsonschema permet de vérifier les données reçues par le serveur, il se trouve dans le dossier "src/main/resources/jsonschema".

## Modèle front-end

Le modèle Front-end manipule un objet model :

* `polls` : Correspondant aux sondages

Il y a une collection globale :

* `model.polls.all` qui contient l'ensemble des objets `poll` synchronisé depuis le serveur.
