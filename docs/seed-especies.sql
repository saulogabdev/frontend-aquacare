-- Espécies de exemplo para testes e para a apresentação do AquaCare.
-- Valores aproximados (faixas usuais de aquarismo). CONFERIR com as referências do artigo antes da banca.
-- Pode rodar mais de uma vez: só insere se o nome científico ainda não existir.
--
-- Combinações úteis para a demonstração (regras do CompatibilidadeService):
--   Neon + Coridora + Otocinclus + Tetra-cardinal  -> compatíveis (comunitário pacífico)
--   Neon + Acará-bandeira                          -> INCOMPATÍVEL: risco de predação (15 cm / 3,5 cm >= 3)
--   Coridora + Oscar                               -> INCOMPATÍVEL: risco de predação / agressivo
--   Neon + Guppy                                   -> compatíveis (pH se encontra em 7,0)
--   Guppy (pH 7–8,5) + Tetra-cardinal (pH 4,5–6,8) -> INCOMPATÍVEL: faixas de pH não se sobrepõem

INSERT INTO animal (nome_popular, nome_cientifico, descricao, temp_min, temp_max, ph_min, ph_max,
  agressividade, padrao_territorial, tamanho_medio, regiao_nado, habito_alimentar,
  sensibilidade_amonia, sensibilidade_nitrito, sensibilidade_nitrato, quantidade_minima_grupo)
SELECT * FROM (
  SELECT 'Neon' AS nome_popular, 'Paracheirodon innesi' AS nome_cientifico,
         'Peixe pequeno de cardume, sensível à qualidade da água.' AS descricao,
         20 AS temp_min, 26 AS temp_max, 5.0 AS ph_min, 7.0 AS ph_max,
         'PACIFICO' AS agressividade, 'NAO_TERRITORIAL' AS padrao_territorial, 3.5 AS tamanho_medio,
         'MEIO' AS regiao_nado, 'Onívoro' AS habito_alimentar,
         'ALTA' AS sensibilidade_amonia, 'ALTA' AS sensibilidade_nitrito, 'MEDIA' AS sensibilidade_nitrato,
         6 AS quantidade_minima_grupo
  UNION ALL SELECT 'Tetra-cardinal', 'Paracheirodon axelrodi',
         'Parente do neon, prefere água ácida e mais quente.',
         24, 29, 4.5, 6.8, 'PACIFICO', 'NAO_TERRITORIAL', 4, 'MEIO', 'Onívoro', 'ALTA', 'ALTA', 'MEDIA', 6
  UNION ALL SELECT 'Coridora', 'Corydoras paleatus',
         'Peixe de fundo, vive em grupo e ajuda a revolver o substrato.',
         20, 26, 6.0, 7.8, 'PACIFICO', 'NAO_TERRITORIAL', 6, 'FUNDO', 'Onívoro', 'MEDIA', 'MEDIA', 'MEDIA', 5
  UNION ALL SELECT 'Otocinclus', 'Otocinclus affinis',
         'Pequeno comedor de algas, sensível à água instável.',
         21, 26, 6.0, 7.5, 'PACIFICO', 'NAO_TERRITORIAL', 4, 'FUNDO', 'Herbívoro', 'ALTA', 'ALTA', 'MEDIA', 4
  UNION ALL SELECT 'Guppy', 'Poecilia reticulata',
         'Peixe resistente e colorido, prefere água neutra a alcalina.',
         22, 28, 7.0, 8.5, 'PACIFICO', 'NAO_TERRITORIAL', 4, 'TOPO', 'Onívoro', 'MEDIA', 'MEDIA', 'BAIXA', 3
  UNION ALL SELECT 'Platy', 'Xiphophorus maculatus',
         'Peixe resistente, indicado para iniciantes.',
         20, 26, 7.0, 8.2, 'PACIFICO', 'NAO_TERRITORIAL', 5, 'MEIO', 'Onívoro', 'BAIXA', 'MEDIA', 'BAIXA', 3
  UNION ALL SELECT 'Betta', 'Betta splendens',
         'Machos brigam entre si; nada perto da superfície.',
         24, 30, 6.0, 7.5, 'SEMI_AGRESSIVO', 'TERRITORIAL', 6, 'TOPO', 'Carnívoro', 'MEDIA', 'MEDIA', 'MEDIA', NULL
  UNION ALL SELECT 'Acará-bandeira', 'Pterophyllum scalare',
         'Ciclídeo elegante; pode comer peixes pequenos como o neon.',
         24, 30, 6.0, 7.5, 'SEMI_AGRESSIVO', 'TERRITORIAL', 15, 'MEIO', 'Onívoro', 'MEDIA', 'MEDIA', 'MEDIA', NULL
  UNION ALL SELECT 'Oscar', 'Astronotus ocellatus',
         'Ciclídeo grande e agressivo; precisa de aquário amplo.',
         22, 28, 6.0, 8.0, 'AGRESSIVO', 'TERRITORIAL', 30, 'MEIO', 'Carnívoro', 'BAIXA', 'BAIXA', 'MEDIA', NULL
) AS novas
WHERE NOT EXISTS (SELECT 1 FROM animal a WHERE a.nome_cientifico = novas.nome_cientifico);

SELECT id_animal, nome_popular, ph_min, ph_max, temp_min, temp_max, tamanho_medio FROM animal;
