-- Plantas de exemplo para testes e para a apresentação do AquaCare (catálogo só pode ser cadastrado por ADMIN).
-- Valores aproximados (faixas usuais de aquarismo de água doce). CONFERIR com as referências antes da banca.
-- Pode rodar mais de uma vez: só insere se o nome científico ainda não existir.
-- Obs.: a coluna "descricao" tem no máximo 100 caracteres.
--
-- O que o diagnóstico verifica para cada planta do aquário (DiagnosticoService.verificarPlantas):
--   * LUZ: lúmens dos equipamentos de ILUMINACAO ÷ litragem → < 30 lm/L = BAIXA, 30–60 = MEDIA, > 60 = ALTA.
--     Planta que precisa de mais luz do que isso → alerta ILUMINACAO (atenção).
--     Aquário SEM luminária cadastrada conta como luz BAIXA.
--   * CO2: planta com co2_necessario e aquário sem injeção de CO2 → alerta CO2 (atenção).
--   * COMPATIBILIDADE: planta e peixe sem faixa de pH ou temperatura em comum → alerta (atenção).
--
-- Roteiro para a demonstração:
--   Anúbia ou Musgo-de-java  -> nenhum alerta (luz baixa, sem CO2): "planta fácil".
--   HC Cuba num aquário sem CO2 e sem luminária -> 2 alertas (luz e CO2).
--     Editar o aquário e ligar "Tem injeção de CO2?" -> o alerta de CO2 some; fica só o de luz.

INSERT INTO planta (nome_popular, nome_cientifico, descricao, dificuldade, iluminacao, co2necessario,
  crescimento, altura_cm, temp_min, temp_max, ph_min, ph_max)
SELECT * FROM (
  SELECT 'Anúbia' AS nome_popular, 'Anubias barteri' AS nome_cientifico,
         'Muito resistente; prende-se em troncos e pedras.' AS descricao,
         'FACIL' AS dificuldade, 'BAIXA' AS iluminacao, 0 AS co2necessario,
         'LENTO' AS crescimento, 30 AS altura_cm, 22 AS temp_min, 28 AS temp_max, 6.0 AS ph_min, 7.5 AS ph_max
  UNION ALL SELECT 'Samambaia-de-java', 'Microsorum pteropus',
         'Resistente e de pouca luz; não deve ser enterrada.',
         'FACIL', 'BAIXA', 0, 'LENTO', 30, 20, 28, 6.0, 7.5
  UNION ALL SELECT 'Musgo-de-java', 'Taxiphyllum barbieri',
         'Musgo fácil, usado para decorar e abrigar filhotes.',
         'FACIL', 'BAIXA', 0, 'LENTO', 10, 18, 28, 5.5, 7.5
  UNION ALL SELECT 'Elódea', 'Egeria densa',
         'Cresce rápido e ajuda a consumir nitrato.',
         'FACIL', 'MEDIA', 0, 'RAPIDO', 50, 16, 26, 6.5, 8.0
  UNION ALL SELECT 'Valisnéria', 'Vallisneria spiralis',
         'Folhas longas em fita; boa para o fundo do aquário.',
         'FACIL', 'MEDIA', 0, 'RAPIDO', 60, 20, 28, 6.5, 8.0
  UNION ALL SELECT 'Espada-amazônica', 'Echinodorus bleheri',
         'Planta grande de fundo; gosta de substrato fértil.',
         'MEDIO', 'MEDIA', 0, 'MEDIO', 50, 22, 28, 6.5, 7.5
  UNION ALL SELECT 'Cabomba', 'Cabomba caroliniana',
         'Folhas finas; precisa de bastante luz.',
         'MEDIO', 'ALTA', 0, 'RAPIDO', 50, 22, 27, 6.0, 7.0
  UNION ALL SELECT 'Rotala', 'Rotala rotundifolia',
         'Fica avermelhada com luz forte.',
         'MEDIO', 'ALTA', 0, 'RAPIDO', 40, 22, 28, 6.0, 7.5
  UNION ALL SELECT 'HC Cuba', 'Hemianthus callitrichoides',
         'Forma tapete no fundo; exige CO2 e luz forte.',
         'DIFICIL', 'ALTA', 1, 'MEDIO', 3, 20, 26, 6.0, 7.0
  UNION ALL SELECT 'Glossostigma', 'Glossostigma elatinoides',
         'Planta de tapete exigente; precisa de CO2.',
         'DIFICIL', 'ALTA', 1, 'RAPIDO', 3, 22, 26, 5.5, 7.0
) AS novas
WHERE NOT EXISTS (SELECT 1 FROM planta p WHERE p.nome_cientifico = novas.nome_cientifico);

SELECT id_planta, nome_popular, dificuldade, iluminacao, co2necessario FROM planta;
