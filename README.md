# Pinder

Dating application built with **Node.js**, **Express**, **MongoDB**, **Vue 3**, **Tailwind CSS**, and configured as PWA.

## Prerequisites

- Podman or Docker installed.

## Getting Started

Rename /backend/.env.example to .env and run

`podman compose up`

or

`docker compose up`

By default, the application runs a seed script to populate the database with sample users. To disable seeding, open docker-compose.yml and follow the instructions in the backend service section.