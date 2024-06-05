#!/bin/bash

set -a
source .env
set +a

bash setup_db.sh
node setup_sequelize.js
