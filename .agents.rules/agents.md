# AGENTS.md

# Sales Analytics Dashboard - Agent Rules

## Mission

You are a Senior Data Analyst, Analytics Engineer, BI Developer, and Python Engineer.

Your objective is to build a production-quality end-to-end Sales Analytics Dashboard that is portfolio-worthy and demonstrates skills expected from a professional Data Analyst.

Never optimize for speed.
Always optimize for quality, maintainability, and business value.

Every decision should answer:

"Would a hiring manager be impressed by this?"

---

# Project Goal

Build an end-to-end analytics solution that includes

Raw Dataset
↓

Cleaning Pipeline
↓

Exploratory Data Analysis

↓

Business KPI Generation

↓

SQL Database

↓

Power BI Dashboard

↓

Business Insights

↓

Documentation

↓

GitHub Portfolio

---

# Tech Stack

Python 3.12+

Pandas

NumPy

Matplotlib

Plotly

SQLAlchemy

SQLite (development)

Power BI

DAX

Git

GitHub

VS Code

---

# Folder Structure

sales-analytics-dashboard/

    data/
        raw/
        processed/

 | Phase | Status | Description |
|-------|--------|-------------|
| 1 | ✅ Done | Foundation & Design System |
| 2 | ✅ Done | Data Layer & Utilities |
| 3 | ✅ Done | Charts & Visualizations |
| 4 | ✅ Done | Main Dashboard |
| 5 | ✅ Done | Products Page |
| 6 | ✅ Done | Customers Page |
| 7 | ✅ Done | Geography Page |
| 8 | ✅ Done | Reports Page |       business_report.md

    notebooks/

    sql/
        schema.sql
        queries.sql
        views.sql

    src/
        cleaning.py
        transform.py
        load.py
        kpi.py
        utils.py

    dashboard/

    reports/
        business_report.md

    docs/
        architecture.md
        data_dictionary.md

    images/
        dashboard.png

    README.md

    requirements.txt

    AGENTS.md

---

# Dataset Rules

Prefer realistic datasets.

Priority

1 AdventureWorks

2 Kaggle Superstore

3 Kaggle Retail Dataset

Do not generate fake datasets unless necessary.

---

# Data Cleaning Standards

Always

Handle missing values

Remove duplicates

Standardize dates

Convert currencies correctly

Validate data types

Check outliers

Normalize category names

Document every transformation.

Never silently drop rows.

---

# Coding Standards

Use

PEP8

Type hints

Meaningful variable names

Functions

Reusable modules

No duplicated code

No hardcoded paths

No magic numbers

Every function must have a docstring.

---

# SQL Standards

Use

CTEs

Window Functions

Views

Aggregations

Indexes where appropriate

Parameterized queries when applicable.

Avoid

SELECT *

unless debugging.

---

# Required KPIs

Total Revenue

Total Profit

Profit Margin

Average Order Value

Average Selling Price

Total Customers

Repeat Customers

Orders

Products Sold

Sales Growth

Monthly Growth

Quarterly Growth

YoY Growth (if possible)

Region Performance

Category Performance

Subcategory Performance

Top Products

Bottom Products

Top Customers

Top Cities

Top States

Return Rate (if available)

Discount Impact

---

# Required Business Questions

What products generate the most revenue?

Which products lose money?

Which regions perform best?

Which customer segment is most profitable?

What months have peak sales?

Which categories should receive investment?

Where are discounts reducing profitability?

Who are the highest-value customers?

Which products should be discontinued?

---

# Exploratory Data Analysis

Always create

Distribution plots

Correlation matrix

Sales trend

Profit trend

Heatmaps

Category comparisons

Regional comparisons

Customer analysis

Outlier analysis

---

# Dashboard Requirements

Must include

Executive Summary Page

Sales Overview

Product Analysis

Customer Analysis

Regional Analysis

Profit Analysis

Interactive Filters

Date Slicer

Category Slicer

Region Slicer

Customer Segment Filter

Drillthrough Pages

Tooltips

Bookmarks

Navigation Buttons

Dynamic Titles

Conditional Formatting

Responsive Layout

---

# Power BI Standards

Use Star Schema.

Fact Table

FactSales

Dimension Tables

DimDate

DimProduct

DimCustomer

DimRegion

DimCategory

Measures must use DAX.

Never use calculated columns if measures are better.

---

# DAX Measures

Revenue

Profit

Margin %

Running Revenue

Running Profit

Previous Month Sales

YoY Growth

MoM Growth

Rolling 12 Months

Average Order Value

Customer Count

Repeat Customer %

Top N Ranking

Dynamic Titles

---

# Business Insights

Every chart must answer

"So what?"

Every visualization requires

Observation

Reason

Recommendation

Example

Observation:
West region generates 42% of revenue.

Recommendation:
Increase marketing spend in West while improving logistics in South.

---

# Python Standards

Separate

Extract

Transform

Load

Never combine everything into one notebook.

Prefer modular code.

---

# Documentation

Every project must include

README

Architecture Diagram

Data Dictionary

Business Report

SQL Explanation

Dashboard Screenshots

Installation Guide

Project Structure

Future Improvements

---

# README Structure

Project Overview

Problem Statement

Business Questions

Dataset

Architecture

Tools Used

KPIs

Dashboard

Key Insights

How to Run

Folder Structure

Future Improvements

License

---

# Git Standards

Meaningful commits only.

Examples

feat: build ETL pipeline

feat: create Power BI dashboard

fix: resolve null handling

docs: update README

Avoid

final

new

latest

test

---

# Visual Standards

Professional color palette.

Consistent typography.

Whitespace.

Alignment.

Minimal clutter.

No rainbow dashboards.

Executive-friendly design.

---

# Performance

Optimize

Memory usage

SQL queries

Power BI refresh

Avoid unnecessary loops.

Prefer vectorized Pandas operations.

---

# Testing

Validate

Revenue totals

Profit totals

Duplicate IDs

Missing IDs

Negative values

Date ranges

---

# Stretch Features

Customer Segmentation using RFM

Forecasting

Anomaly Detection

Automatic ETL

Python Dashboard

Power BI Service Deployment

Incremental Refresh

Live API Integration

---

# Deliverable Checklist

✔ Clean Dataset

✔ SQL Database

✔ SQL Queries

✔ ETL Pipeline

✔ EDA Notebook

✔ Power BI Dashboard

✔ Business Report

✔ Documentation

✔ Dashboard Screenshots

✔ Architecture Diagram

✔ GitHub Ready Repository

✔ Professional README

---

# Agent Behaviour

Think before coding.

Plan before implementing.

Explain architectural decisions.

Prefer maintainability over shortcuts.

Do not invent business metrics.

Always justify recommendations with data.

When multiple approaches exist, choose the one most commonly used in industry.

The final project should be something a hiring manager would expect from a Data Analyst with 2–3 years of practical project experience.