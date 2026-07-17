# AgroMesh AI - Makefile for development shortcuts

.PHONY: help dev-up dev-down dev-logs backend-dev web-install web-dev db-migrate db-seed clean start stop logs

# Colors
BLUE := \033[0;34m
GREEN := \033[0;32m
YELLOW := \033[0;33m
NC := \033[0m # No Color

# Default target
help:
	@echo "$(BLUE)AgroMesh AI - Development Commands$(NC)"
	@echo ""
	@echo "$(GREEN)Docker Commands:$(NC)"
	@echo "  make dev-up      $(YELLOW)- Start all Docker services$(NC)"
	@echo "  make dev-down    $(YELLOW)- Stop all Docker services$(NC)"
	@echo "  make dev-logs    $(YELLOW)- View Docker logs (follow)$(NC)"
	@echo "  make clean       $(YELLOW)- Stop services and remove volumes$(NC)"
	@echo ""
	@echo "$(GREEN)Backend Commands:$(NC)"
	@echo "  make backend-dev  $(YELLOW)- Run backend with hot reload (local)$(NC)"
	@echo ""
	@echo "$(GREEN)Frontend Commands:$(NC)"
	@echo "  make web-install $(YELLOW)- Install frontend dependencies$(NC)"
	@echo "  make web-dev     $(YELLOW)- Run frontend dev server$(NC)"
	@echo ""
	@echo "$(GREEN)Quick Commands:$(NC)"
	@echo "  make start       $(YELLOW)- Same as dev-up$(NC)"
	@echo "  make stop        $(YELLOW)- Same as dev-down$(NC)"
	@echo "  make logs        $(YELLOW)- Same as dev-logs$(NC)"

# Docker commands
dev-up:
	@echo "$(GREEN)Starting AgroMesh AI services...$(NC)"
	docker-compose up -d

dev-down:
	@echo "$(YELLOW)Stopping AgroMesh AI services...$(NC)"
	docker-compose down

dev-logs:
	docker-compose logs -f

start: dev-up

stop: dev-down

logs: dev-logs

# Backend commands (local development)
backend-dev:
	@echo "$(GREEN)Starting backend with hot reload...$(NC)"
	cd apps/backend && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

backend-shell:
	@echo "$(GREEN)Opening backend shell...$(NC)"
	cd apps/backend && bash

# Frontend commands
web-install:
	@echo "$(GREEN)Installing frontend dependencies...$(NC)"
	cd apps/web && npm install

web-dev:
	@echo "$(GREEN)Starting frontend dev server...$(NC)"
	cd apps/web && npm run dev

web-build:
	@echo "$(GREEN)Building frontend...$(NC)"
	cd apps/web && npm run build

# Database commands
db-migrate:
	@echo "$(GREEN)Running database migrations...$(NC)"
	cd apps/backend && alembic upgrade head

db-seed:
	@echo "$(GREEN)Seeding database...$(NC)"
	cd apps/backend && python -m app.seed

# Cleanup
clean:
	@echo "$(YELLOW)Cleaning up Docker containers and volumes...$(NC)"
	docker-compose down -v
	@echo "$(YELLOW)Removing node_modules...$(NC)"
	rm -rf apps/web/node_modules
	rm -rf apps/web/.next

# Health check
health:
	@echo "$(GREEN)Checking service health...$(NC)"
	@echo "Backend API: http://localhost:8000/docs"
	@echo "Frontend: http://localhost:3000"
	@echo "MinIO Console: http://localhost:9001"
	curl -s http://localhost:8000/health || echo "Backend not responding"