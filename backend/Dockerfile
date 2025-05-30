# backend/Dockerfile

FROM python:3.11-slim

# Define diretório de trabalho
WORKDIR /app

# Copia dependências
COPY requirements.txt .

# Instala dependências
RUN pip install --no-cache-dir -r requirements.txt

# Copia o restante do código
COPY . .

# Expondo a porta do Flask
EXPOSE 5000

# Rodando com Gunicorn para produção
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "app:app"]
