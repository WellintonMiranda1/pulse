// Base fictícia de demonstração do Pulse
// 3 vendedores, 30 clientes, histórico de vendas, metas, projeções e estados variados.
// Todos os nomes e dados comerciais abaixo são fictícios.

export const seedProfiles = [
  {
    "id": "p1",
    "name": "Wellinton",
    "avatar_color": "from-blue-500 to-indigo-600",
    "active": true
  },
  {
    "id": "p2",
    "name": "Lucas",
    "avatar_color": "from-cyan-500 to-blue-600",
    "active": true
  },
  {
    "id": "p3",
    "name": "Rafael",
    "avatar_color": "from-amber-500 to-orange-600",
    "active": true
  }
];

export const seedClients = [
  {
    "id": "c01",
    "profile_id": "p1",
    "name": "Delta Medical",
    "company": "Delta Medical Ltda",
    "email": "contato@deltamedical.demo",
    "phone": "(00) 90000-0000",
    "segment": "Clínica",
    "estado": "RS",
    "origin": "lead",
    "notes": "Cliente fictício para demonstração do Pulse.",
    "inadimplente": false,
    "perdido": false,
    "motivo_perda": "",
    "registration_date": "2026-05-08"
  },
  {
    "id": "c02",
    "profile_id": "p1",
    "name": "SulCare",
    "company": "SulCare Bem-Estar",
    "email": "contato@sulcare.demo",
    "phone": "(00) 90000-0000",
    "segment": "Bem-estar",
    "estado": "SC",
    "origin": "prospeccao",
    "notes": "Cliente fictício para demonstração do Pulse.",
    "inadimplente": false,
    "perdido": false,
    "motivo_perda": "",
    "registration_date": "2026-05-18"
  },
  {
    "id": "c03",
    "profile_id": "p1",
    "name": "Paraná Comfort",
    "company": "Paraná Comfort Saúde",
    "email": "contato@paranacomfort.demo",
    "phone": "(00) 90000-0000",
    "segment": "Varejo",
    "estado": "PR",
    "origin": "indicacao",
    "notes": "Cliente fictício para demonstração do Pulse.",
    "inadimplente": false,
    "perdido": false,
    "motivo_perda": "",
    "registration_date": "2026-06-03"
  },
  {
    "id": "c04",
    "profile_id": "p1",
    "name": "Viva Saúde",
    "company": "Viva Saúde Integrada",
    "email": "contato@vivasaude.demo",
    "phone": "(00) 90000-0000",
    "segment": "Saúde",
    "estado": "SP",
    "origin": "lead",
    "notes": "Cliente fictício para demonstração do Pulse.",
    "inadimplente": false,
    "perdido": false,
    "motivo_perda": "",
    "registration_date": "2026-06-22"
  },
  {
    "id": "c05",
    "profile_id": "p1",
    "name": "Clínica Serra",
    "company": "Clínica Serra Ltda",
    "email": "contato@clinicaserra.demo",
    "phone": "(00) 90000-0000",
    "segment": "Clínica",
    "estado": "RS",
    "origin": "prospeccao",
    "notes": "Cliente fictício para demonstração do Pulse.",
    "inadimplente": false,
    "perdido": false,
    "motivo_perda": "",
    "registration_date": "2026-07-07"
  },
  {
    "id": "c06",
    "profile_id": "p1",
    "name": "Horizonte Sul",
    "company": "Horizonte Sul Comércio",
    "email": "contato@horizontesul.demo",
    "phone": "(00) 90000-0000",
    "segment": "Varejo",
    "estado": "SC",
    "origin": "indicacao",
    "notes": "Cliente fictício para demonstração do Pulse.",
    "inadimplente": false,
    "perdido": false,
    "motivo_perda": "",
    "registration_date": "2026-07-25"
  },
  {
    "id": "c07",
    "profile_id": "p1",
    "name": "Prime Fisio",
    "company": "Prime Fisioterapia",
    "email": "contato@primefisio.demo",
    "phone": "(00) 90000-0000",
    "segment": "Fisioterapia",
    "estado": "MG",
    "origin": "lead",
    "notes": "Cliente fictício para demonstração do Pulse.",
    "inadimplente": false,
    "perdido": false,
    "motivo_perda": "",
    "registration_date": "2026-08-10"
  },
  {
    "id": "c08",
    "profile_id": "p1",
    "name": "Essência Wellness",
    "company": "Essência Wellness Center",
    "email": "contato@essênciawellness.demo",
    "phone": "(00) 90000-0000",
    "segment": "Bem-estar",
    "estado": "RJ",
    "origin": "prospeccao",
    "notes": "Cliente fictício para demonstração do Pulse.",
    "inadimplente": false,
    "perdido": false,
    "motivo_perda": "",
    "registration_date": "2026-03-12"
  },
  {
    "id": "c09",
    "profile_id": "p1",
    "name": "Orto Center",
    "company": "Orto Center Goiás",
    "email": "contato@ortocenter.demo",
    "phone": "(00) 90000-0000",
    "segment": "Ortopedia",
    "estado": "GO",
    "origin": "lead",
    "notes": "Cliente fictício para demonstração do Pulse.",
    "inadimplente": false,
    "perdido": false,
    "motivo_perda": "",
    "registration_date": "2026-09-28"
  },
  {
    "id": "c10",
    "profile_id": "p1",
    "name": "Vida Plena",
    "company": "Vida Plena Bahia",
    "email": "contato@vidaplena.demo",
    "phone": "(00) 90000-0000",
    "segment": "Saúde",
    "estado": "BA",
    "origin": "indicacao",
    "notes": "Cliente fictício para demonstração do Pulse.",
    "inadimplente": false,
    "perdido": true,
    "motivo_perda": "Sem avanço comercial no período.",
    "registration_date": "2026-02-04"
  },
  {
    "id": "c11",
    "profile_id": "p2",
    "name": "NovaForma",
    "company": "NovaForma Produtos",
    "email": "contato@novaforma.demo",
    "phone": "(00) 90000-0000",
    "segment": "Varejo",
    "estado": "SP",
    "origin": "lead",
    "notes": "Cliente fictício para demonstração do Pulse.",
    "inadimplente": false,
    "perdido": false,
    "motivo_perda": "",
    "registration_date": "2026-04-14"
  },
  {
    "id": "c12",
    "profile_id": "p2",
    "name": "BioMov",
    "company": "BioMov Fisioterapia",
    "email": "contato@biomov.demo",
    "phone": "(00) 90000-0000",
    "segment": "Fisioterapia",
    "estado": "MG",
    "origin": "prospeccao",
    "notes": "Cliente fictício para demonstração do Pulse.",
    "inadimplente": false,
    "perdido": false,
    "motivo_perda": "",
    "registration_date": "2026-05-21"
  },
  {
    "id": "c13",
    "profile_id": "p2",
    "name": "Atlântico Saúde",
    "company": "Atlântico Saúde Ltda",
    "email": "contato@atlânticosaude.demo",
    "phone": "(00) 90000-0000",
    "segment": "Clínica",
    "estado": "RJ",
    "origin": "indicacao",
    "notes": "Cliente fictício para demonstração do Pulse.",
    "inadimplente": false,
    "perdido": false,
    "motivo_perda": "",
    "registration_date": "2026-06-08"
  },
  {
    "id": "c14",
    "profile_id": "p2",
    "name": "Centro Vida",
    "company": "Centro Vida Capixaba",
    "email": "contato@centrovida.demo",
    "phone": "(00) 90000-0000",
    "segment": "Saúde",
    "estado": "ES",
    "origin": "lead",
    "notes": "Cliente fictício para demonstração do Pulse.",
    "inadimplente": false,
    "perdido": false,
    "motivo_perda": "",
    "registration_date": "2026-07-02"
  },
  {
    "id": "c15",
    "profile_id": "p2",
    "name": "Capital Fisio",
    "company": "Capital Fisio DF",
    "email": "contato@capitalfisio.demo",
    "phone": "(00) 90000-0000",
    "segment": "Fisioterapia",
    "estado": "DF",
    "origin": "prospeccao",
    "notes": "Cliente fictício para demonstração do Pulse.",
    "inadimplente": false,
    "perdido": false,
    "motivo_perda": "",
    "registration_date": "2026-09-25"
  },
  {
    "id": "c16",
    "profile_id": "p2",
    "name": "Nordeste Care",
    "company": "Nordeste Care Ltda",
    "email": "contato@nordestecare.demo",
    "phone": "(00) 90000-0000",
    "segment": "Bem-estar",
    "estado": "PE",
    "origin": "lead",
    "notes": "Cliente fictício para demonstração do Pulse.",
    "inadimplente": false,
    "perdido": false,
    "motivo_perda": "",
    "registration_date": "2026-08-03"
  },
  {
    "id": "c17",
    "profile_id": "p2",
    "name": "Ceará Wellness",
    "company": "Ceará Wellness",
    "email": "contato@cearawellness.demo",
    "phone": "(00) 90000-0000",
    "segment": "Bem-estar",
    "estado": "CE",
    "origin": "prospeccao",
    "notes": "Cliente fictício para demonstração do Pulse.",
    "inadimplente": false,
    "perdido": false,
    "motivo_perda": "",
    "registration_date": "2026-03-19"
  },
  {
    "id": "c18",
    "profile_id": "p2",
    "name": "Mais Saúde",
    "company": "Mais Saúde Paraná",
    "email": "contato@maissaude.demo",
    "phone": "(00) 90000-0000",
    "segment": "Saúde",
    "estado": "PR",
    "origin": "indicacao",
    "notes": "Cliente fictício para demonstração do Pulse.",
    "inadimplente": false,
    "perdido": false,
    "motivo_perda": "",
    "registration_date": "2026-08-28"
  },
  {
    "id": "c19",
    "profile_id": "p2",
    "name": "Norte Medical",
    "company": "Norte Medical Pará",
    "email": "contato@nortemedical.demo",
    "phone": "(00) 90000-0000",
    "segment": "Clínica",
    "estado": "PA",
    "origin": "lead",
    "notes": "Cliente fictício para demonstração do Pulse.",
    "inadimplente": false,
    "perdido": false,
    "motivo_perda": "",
    "registration_date": "2026-09-30"
  },
  {
    "id": "c20",
    "profile_id": "p2",
    "name": "Equilíbrio SC",
    "company": "Equilíbrio Santa Catarina",
    "email": "contato@equilibriosc.demo",
    "phone": "(00) 90000-0000",
    "segment": "Fisioterapia",
    "estado": "SC",
    "origin": "prospeccao",
    "notes": "Cliente fictício para demonstração do Pulse.",
    "inadimplente": false,
    "perdido": true,
    "motivo_perda": "Sem avanço comercial no período.",
    "registration_date": "2026-01-17"
  },
  {
    "id": "c21",
    "profile_id": "p3",
    "name": "Vitalis",
    "company": "Vitalis Saúde",
    "email": "contato@vitalis.demo",
    "phone": "(00) 90000-0000",
    "segment": "Saúde",
    "estado": "SP",
    "origin": "lead",
    "notes": "Cliente fictício para demonstração do Pulse.",
    "inadimplente": false,
    "perdido": false,
    "motivo_perda": "",
    "registration_date": "2026-04-05"
  },
  {
    "id": "c22",
    "profile_id": "p3",
    "name": "Amazon Care",
    "company": "Amazon Care Ltda",
    "email": "contato@amazoncare.demo",
    "phone": "(00) 90000-0000",
    "segment": "Clínica",
    "estado": "AM",
    "origin": "prospeccao",
    "notes": "Cliente fictício para demonstração do Pulse.",
    "inadimplente": false,
    "perdido": false,
    "motivo_perda": "",
    "registration_date": "2026-02-20"
  },
  {
    "id": "c23",
    "profile_id": "p3",
    "name": "Cerrado Health",
    "company": "Cerrado Health Goiás",
    "email": "contato@cerradohealth.demo",
    "phone": "(00) 90000-0000",
    "segment": "Saúde",
    "estado": "GO",
    "origin": "indicacao",
    "notes": "Cliente fictício para demonstração do Pulse.",
    "inadimplente": false,
    "perdido": false,
    "motivo_perda": "",
    "registration_date": "2026-06-13"
  },
  {
    "id": "c24",
    "profile_id": "p3",
    "name": "Pantanal Fisio",
    "company": "Pantanal Fisioterapia",
    "email": "contato@pantanalfisio.demo",
    "phone": "(00) 90000-0000",
    "segment": "Fisioterapia",
    "estado": "MT",
    "origin": "lead",
    "notes": "Cliente fictício para demonstração do Pulse.",
    "inadimplente": false,
    "perdido": false,
    "motivo_perda": "",
    "registration_date": "2026-02-27"
  },
  {
    "id": "c25",
    "profile_id": "p3",
    "name": "Bahia Life",
    "company": "Bahia Life Bem-Estar",
    "email": "contato@bahialife.demo",
    "phone": "(00) 90000-0000",
    "segment": "Bem-estar",
    "estado": "BA",
    "origin": "prospeccao",
    "notes": "Cliente fictício para demonstração do Pulse.",
    "inadimplente": false,
    "perdido": false,
    "motivo_perda": "",
    "registration_date": "2026-09-26"
  },
  {
    "id": "c26",
    "profile_id": "p3",
    "name": "Recife Orto",
    "company": "Recife Ortopedia",
    "email": "contato@recifeorto.demo",
    "phone": "(00) 90000-0000",
    "segment": "Ortopedia",
    "estado": "PE",
    "origin": "lead",
    "notes": "Cliente fictício para demonstração do Pulse.",
    "inadimplente": false,
    "perdido": false,
    "motivo_perda": "",
    "registration_date": "2026-08-11"
  },
  {
    "id": "c27",
    "profile_id": "p3",
    "name": "Serra Azul",
    "company": "Serra Azul Comercial",
    "email": "contato@serraazul.demo",
    "phone": "(00) 90000-0000",
    "segment": "Varejo",
    "estado": "RS",
    "origin": "indicacao",
    "notes": "Cliente fictício para demonstração do Pulse.",
    "inadimplente": false,
    "perdido": false,
    "motivo_perda": "",
    "registration_date": "2026-07-16"
  },
  {
    "id": "c28",
    "profile_id": "p3",
    "name": "Vale Saúde",
    "company": "Vale Saúde Minas",
    "email": "contato@valesaude.demo",
    "phone": "(00) 90000-0000",
    "segment": "Clínica",
    "estado": "MG",
    "origin": "lead",
    "notes": "Cliente fictício para demonstração do Pulse.",
    "inadimplente": false,
    "perdido": false,
    "motivo_perda": "",
    "registration_date": "2026-08-19"
  },
  {
    "id": "c29",
    "profile_id": "p3",
    "name": "Litoral Care",
    "company": "Litoral Care SC",
    "email": "contato@litoralcare.demo",
    "phone": "(00) 90000-0000",
    "segment": "Bem-estar",
    "estado": "SC",
    "origin": "prospeccao",
    "notes": "Cliente fictício para demonstração do Pulse.",
    "inadimplente": false,
    "perdido": false,
    "motivo_perda": "",
    "registration_date": "2026-09-03"
  },
  {
    "id": "c30",
    "profile_id": "p3",
    "name": "Brasília Med",
    "company": "Brasília Med DF",
    "email": "contato@brasiliamed.demo",
    "phone": "(00) 90000-0000",
    "segment": "Clínica",
    "estado": "DF",
    "origin": "lead",
    "notes": "Cliente fictício para demonstração do Pulse.",
    "inadimplente": false,
    "perdido": false,
    "motivo_perda": "",
    "registration_date": "2026-09-29"
  }
];

export const seedPurchases = [
  {
    "id": "v001",
    "profile_id": "p1",
    "client_id": "c01",
    "amount": 5200.0,
    "date": "2026-05-12",
    "description": "Venda demonstrativa"
  },
  {
    "id": "v002",
    "profile_id": "p1",
    "client_id": "c01",
    "amount": 6100.0,
    "date": "2026-07-18",
    "description": "Venda demonstrativa"
  },
  {
    "id": "v003",
    "profile_id": "p1",
    "client_id": "c01",
    "amount": 5900.0,
    "date": "2026-09-05",
    "description": "Venda demonstrativa"
  },
  {
    "id": "v004",
    "profile_id": "p1",
    "client_id": "c02",
    "amount": 3800.0,
    "date": "2026-05-25",
    "description": "Venda demonstrativa"
  },
  {
    "id": "v005",
    "profile_id": "p1",
    "client_id": "c02",
    "amount": 4300.0,
    "date": "2026-08-14",
    "description": "Venda demonstrativa"
  },
  {
    "id": "v006",
    "profile_id": "p1",
    "client_id": "c02",
    "amount": 4100.0,
    "date": "2026-09-21",
    "description": "Venda demonstrativa"
  },
  {
    "id": "v007",
    "profile_id": "p1",
    "client_id": "c03",
    "amount": 7200.0,
    "date": "2026-06-11",
    "description": "Venda demonstrativa"
  },
  {
    "id": "v008",
    "profile_id": "p1",
    "client_id": "c03",
    "amount": 6800.0,
    "date": "2026-08-07",
    "description": "Venda demonstrativa"
  },
  {
    "id": "v009",
    "profile_id": "p1",
    "client_id": "c04",
    "amount": 8900.0,
    "date": "2026-06-28",
    "description": "Venda demonstrativa"
  },
  {
    "id": "v010",
    "profile_id": "p1",
    "client_id": "c04",
    "amount": 9300.0,
    "date": "2026-08-29",
    "description": "Venda demonstrativa"
  },
  {
    "id": "v011",
    "profile_id": "p1",
    "client_id": "c04",
    "amount": 7600.0,
    "date": "2026-09-27",
    "description": "Venda demonstrativa"
  },
  {
    "id": "v012",
    "profile_id": "p1",
    "client_id": "c05",
    "amount": 4700.0,
    "date": "2026-07-15",
    "description": "Venda demonstrativa"
  },
  {
    "id": "v013",
    "profile_id": "p1",
    "client_id": "c05",
    "amount": 5100.0,
    "date": "2026-09-11",
    "description": "Venda demonstrativa"
  },
  {
    "id": "v014",
    "profile_id": "p1",
    "client_id": "c06",
    "amount": 6200.0,
    "date": "2026-07-29",
    "description": "Venda demonstrativa"
  },
  {
    "id": "v015",
    "profile_id": "p1",
    "client_id": "c06",
    "amount": 6900.0,
    "date": "2026-09-18",
    "description": "Venda demonstrativa"
  },
  {
    "id": "v016",
    "profile_id": "p1",
    "client_id": "c07",
    "amount": 5900.0,
    "date": "2026-08-17",
    "description": "Venda demonstrativa"
  },
  {
    "id": "v017",
    "profile_id": "p1",
    "client_id": "c07",
    "amount": 6100.0,
    "date": "2026-09-24",
    "description": "Venda demonstrativa"
  },
  {
    "id": "v018",
    "profile_id": "p1",
    "client_id": "c08",
    "amount": 4500.0,
    "date": "2026-04-03",
    "description": "Venda demonstrativa"
  },
  {
    "id": "v019",
    "profile_id": "p1",
    "client_id": "c08",
    "amount": 5200.0,
    "date": "2026-06-20",
    "description": "Venda demonstrativa"
  },
  {
    "id": "v020",
    "profile_id": "p1",
    "client_id": "c10",
    "amount": 3900.0,
    "date": "2026-03-08",
    "description": "Venda demonstrativa"
  },
  {
    "id": "v021",
    "profile_id": "p1",
    "client_id": "c10",
    "amount": 4100.0,
    "date": "2026-06-02",
    "description": "Venda demonstrativa"
  },
  {
    "id": "v022",
    "profile_id": "p1",
    "client_id": "c01",
    "amount": 6800.0,
    "date": "2026-10-01",
    "description": "Venda demonstrativa"
  },
  {
    "id": "v023",
    "profile_id": "p1",
    "client_id": "c02",
    "amount": 4200.0,
    "date": "2026-10-02",
    "description": "Venda demonstrativa"
  },
  {
    "id": "v024",
    "profile_id": "p1",
    "client_id": "c03",
    "amount": 7900.0,
    "date": "2026-10-03",
    "description": "Venda demonstrativa"
  },
  {
    "id": "v025",
    "profile_id": "p1",
    "client_id": "c04",
    "amount": 9500.0,
    "date": "2026-10-05",
    "description": "Venda demonstrativa"
  },
  {
    "id": "v026",
    "profile_id": "p1",
    "client_id": "c05",
    "amount": 5600.0,
    "date": "2026-10-06",
    "description": "Venda demonstrativa"
  },
  {
    "id": "v027",
    "profile_id": "p1",
    "client_id": "c06",
    "amount": 7200.0,
    "date": "2026-10-08",
    "description": "Venda demonstrativa"
  },
  {
    "id": "v028",
    "profile_id": "p1",
    "client_id": "c07",
    "amount": 6300.0,
    "date": "2026-10-10",
    "description": "Venda demonstrativa"
  },
  {
    "id": "v029",
    "profile_id": "p1",
    "client_id": "c09",
    "amount": 5800.0,
    "date": "2026-10-11",
    "description": "Venda demonstrativa"
  },
  {
    "id": "v030",
    "profile_id": "p1",
    "client_id": "c01",
    "amount": 3250.0,
    "date": "2026-10-12",
    "description": "Venda demonstrativa"
  },
  {
    "id": "v031",
    "profile_id": "p1",
    "client_id": "c04",
    "amount": 4900.0,
    "date": "2026-10-13",
    "description": "Venda demonstrativa"
  },
  {
    "id": "v032",
    "profile_id": "p2",
    "client_id": "c11",
    "amount": 7200.0,
    "date": "2026-04-18",
    "description": "Venda demonstrativa"
  },
  {
    "id": "v033",
    "profile_id": "p2",
    "client_id": "c11",
    "amount": 8100.0,
    "date": "2026-06-25",
    "description": "Venda demonstrativa"
  },
  {
    "id": "v034",
    "profile_id": "p2",
    "client_id": "c11",
    "amount": 8500.0,
    "date": "2026-09-09",
    "description": "Venda demonstrativa"
  },
  {
    "id": "v035",
    "profile_id": "p2",
    "client_id": "c12",
    "amount": 5500.0,
    "date": "2026-05-29",
    "description": "Venda demonstrativa"
  },
  {
    "id": "v036",
    "profile_id": "p2",
    "client_id": "c12",
    "amount": 6100.0,
    "date": "2026-07-21",
    "description": "Venda demonstrativa"
  },
  {
    "id": "v037",
    "profile_id": "p2",
    "client_id": "c12",
    "amount": 5800.0,
    "date": "2026-09-14",
    "description": "Venda demonstrativa"
  },
  {
    "id": "v038",
    "profile_id": "p2",
    "client_id": "c13",
    "amount": 6400.0,
    "date": "2026-06-16",
    "description": "Venda demonstrativa"
  },
  {
    "id": "v039",
    "profile_id": "p2",
    "client_id": "c13",
    "amount": 7100.0,
    "date": "2026-08-22",
    "description": "Venda demonstrativa"
  },
  {
    "id": "v040",
    "profile_id": "p2",
    "client_id": "c14",
    "amount": 3600.0,
    "date": "2026-07-06",
    "description": "Venda demonstrativa"
  },
  {
    "id": "v041",
    "profile_id": "p2",
    "client_id": "c14",
    "amount": 3900.0,
    "date": "2026-09-02",
    "description": "Venda demonstrativa"
  },
  {
    "id": "v042",
    "profile_id": "p2",
    "client_id": "c16",
    "amount": 4900.0,
    "date": "2026-08-09",
    "description": "Venda demonstrativa"
  },
  {
    "id": "v043",
    "profile_id": "p2",
    "client_id": "c16",
    "amount": 5300.0,
    "date": "2026-09-26",
    "description": "Venda demonstrativa"
  },
  {
    "id": "v044",
    "profile_id": "p2",
    "client_id": "c17",
    "amount": 4200.0,
    "date": "2026-04-10",
    "description": "Venda demonstrativa"
  },
  {
    "id": "v045",
    "profile_id": "p2",
    "client_id": "c17",
    "amount": 4400.0,
    "date": "2026-06-18",
    "description": "Venda demonstrativa"
  },
  {
    "id": "v046",
    "profile_id": "p2",
    "client_id": "c18",
    "amount": 6200.0,
    "date": "2026-09-01",
    "description": "Venda demonstrativa"
  },
  {
    "id": "v047",
    "profile_id": "p2",
    "client_id": "c20",
    "amount": 3500.0,
    "date": "2026-02-15",
    "description": "Venda demonstrativa"
  },
  {
    "id": "v048",
    "profile_id": "p2",
    "client_id": "c20",
    "amount": 4000.0,
    "date": "2026-06-07",
    "description": "Venda demonstrativa"
  },
  {
    "id": "v049",
    "profile_id": "p2",
    "client_id": "c11",
    "amount": 8800.0,
    "date": "2026-10-01",
    "description": "Venda demonstrativa"
  },
  {
    "id": "v050",
    "profile_id": "p2",
    "client_id": "c12",
    "amount": 6200.0,
    "date": "2026-10-03",
    "description": "Venda demonstrativa"
  },
  {
    "id": "v051",
    "profile_id": "p2",
    "client_id": "c13",
    "amount": 7500.0,
    "date": "2026-10-04",
    "description": "Venda demonstrativa"
  },
  {
    "id": "v052",
    "profile_id": "p2",
    "client_id": "c14",
    "amount": 4100.0,
    "date": "2026-10-05",
    "description": "Venda demonstrativa"
  },
  {
    "id": "v053",
    "profile_id": "p2",
    "client_id": "c15",
    "amount": 9300.0,
    "date": "2026-10-06",
    "description": "Venda demonstrativa"
  },
  {
    "id": "v054",
    "profile_id": "p2",
    "client_id": "c16",
    "amount": 5700.0,
    "date": "2026-10-08",
    "description": "Venda demonstrativa"
  },
  {
    "id": "v055",
    "profile_id": "p2",
    "client_id": "c18",
    "amount": 6800.0,
    "date": "2026-10-09",
    "description": "Venda demonstrativa"
  },
  {
    "id": "v056",
    "profile_id": "p2",
    "client_id": "c19",
    "amount": 4900.0,
    "date": "2026-10-10",
    "description": "Venda demonstrativa"
  },
  {
    "id": "v057",
    "profile_id": "p2",
    "client_id": "c11",
    "amount": 2800.0,
    "date": "2026-10-12",
    "description": "Venda demonstrativa"
  },
  {
    "id": "v058",
    "profile_id": "p3",
    "client_id": "c21",
    "amount": 8500.0,
    "date": "2026-04-12",
    "description": "Venda demonstrativa"
  },
  {
    "id": "v059",
    "profile_id": "p3",
    "client_id": "c21",
    "amount": 9100.0,
    "date": "2026-07-05",
    "description": "Venda demonstrativa"
  },
  {
    "id": "v060",
    "profile_id": "p3",
    "client_id": "c21",
    "amount": 9600.0,
    "date": "2026-09-16",
    "description": "Venda demonstrativa"
  },
  {
    "id": "v061",
    "profile_id": "p3",
    "client_id": "c22",
    "amount": 5100.0,
    "date": "2026-03-11",
    "description": "Venda demonstrativa"
  },
  {
    "id": "v062",
    "profile_id": "p3",
    "client_id": "c22",
    "amount": 5600.0,
    "date": "2026-06-05",
    "description": "Venda demonstrativa"
  },
  {
    "id": "v063",
    "profile_id": "p3",
    "client_id": "c23",
    "amount": 5800.0,
    "date": "2026-06-19",
    "description": "Venda demonstrativa"
  },
  {
    "id": "v064",
    "profile_id": "p3",
    "client_id": "c23",
    "amount": 6200.0,
    "date": "2026-08-27",
    "description": "Venda demonstrativa"
  },
  {
    "id": "v065",
    "profile_id": "p3",
    "client_id": "c24",
    "amount": 4300.0,
    "date": "2026-03-22",
    "description": "Venda demonstrativa"
  },
  {
    "id": "v066",
    "profile_id": "p3",
    "client_id": "c24",
    "amount": 4700.0,
    "date": "2026-06-10",
    "description": "Venda demonstrativa"
  },
  {
    "id": "v067",
    "profile_id": "p3",
    "client_id": "c26",
    "amount": 4900.0,
    "date": "2026-08-20",
    "description": "Venda demonstrativa"
  },
  {
    "id": "v068",
    "profile_id": "p3",
    "client_id": "c26",
    "amount": 5200.0,
    "date": "2026-09-30",
    "description": "Venda demonstrativa"
  },
  {
    "id": "v069",
    "profile_id": "p3",
    "client_id": "c27",
    "amount": 4300.0,
    "date": "2026-07-23",
    "description": "Venda demonstrativa"
  },
  {
    "id": "v070",
    "profile_id": "p3",
    "client_id": "c27",
    "amount": 4600.0,
    "date": "2026-09-06",
    "description": "Venda demonstrativa"
  },
  {
    "id": "v071",
    "profile_id": "p3",
    "client_id": "c28",
    "amount": 5700.0,
    "date": "2026-08-25",
    "description": "Venda demonstrativa"
  },
  {
    "id": "v072",
    "profile_id": "p3",
    "client_id": "c29",
    "amount": 5300.0,
    "date": "2026-09-08",
    "description": "Venda demonstrativa"
  },
  {
    "id": "v073",
    "profile_id": "p3",
    "client_id": "c21",
    "amount": 10200.0,
    "date": "2026-10-02",
    "description": "Venda demonstrativa"
  },
  {
    "id": "v074",
    "profile_id": "p3",
    "client_id": "c23",
    "amount": 6800.0,
    "date": "2026-10-03",
    "description": "Venda demonstrativa"
  },
  {
    "id": "v075",
    "profile_id": "p3",
    "client_id": "c25",
    "amount": 7400.0,
    "date": "2026-10-04",
    "description": "Venda demonstrativa"
  },
  {
    "id": "v076",
    "profile_id": "p3",
    "client_id": "c26",
    "amount": 5500.0,
    "date": "2026-10-06",
    "description": "Venda demonstrativa"
  },
  {
    "id": "v077",
    "profile_id": "p3",
    "client_id": "c27",
    "amount": 4900.0,
    "date": "2026-10-07",
    "description": "Venda demonstrativa"
  },
  {
    "id": "v078",
    "profile_id": "p3",
    "client_id": "c28",
    "amount": 6600.0,
    "date": "2026-10-09",
    "description": "Venda demonstrativa"
  },
  {
    "id": "v079",
    "profile_id": "p3",
    "client_id": "c29",
    "amount": 5900.0,
    "date": "2026-10-11",
    "description": "Venda demonstrativa"
  },
  {
    "id": "v080",
    "profile_id": "p3",
    "client_id": "c30",
    "amount": 7100.0,
    "date": "2026-10-13",
    "description": "Venda demonstrativa"
  }
];

export const seedProjections = [
  {
    "id": "s1",
    "profile_id": "p1",
    "client_id": "c03",
    "client_name": "Paraná Comfort",
    "expected_amount": 12500,
    "expected_date": "2026-10-20",
    "probability": 100,
    "status": "negotiation",
    "is_lead": false
  },
  {
    "id": "s2",
    "profile_id": "p1",
    "client_id": "c09",
    "client_name": "Orto Center",
    "expected_amount": 8900,
    "expected_date": "2026-10-24",
    "probability": 100,
    "status": "proposal",
    "is_lead": false
  },
  {
    "id": "s3",
    "profile_id": "p1",
    "client_id": null,
    "client_name": "Prospect Aurora",
    "expected_amount": 15000,
    "expected_date": "2026-10-30",
    "probability": 100,
    "status": "proposal",
    "is_lead": true
  },
  {
    "id": "s4",
    "profile_id": "p2",
    "client_id": "c15",
    "client_name": "Capital Fisio",
    "expected_amount": 11800,
    "expected_date": "2026-10-21",
    "probability": 100,
    "status": "negotiation",
    "is_lead": false
  },
  {
    "id": "s5",
    "profile_id": "p2",
    "client_id": "c19",
    "client_name": "Norte Medical",
    "expected_amount": 7600,
    "expected_date": "2026-10-26",
    "probability": 100,
    "status": "proposal",
    "is_lead": false
  },
  {
    "id": "s6",
    "profile_id": "p2",
    "client_id": null,
    "client_name": "Lead Orion",
    "expected_amount": 9800,
    "expected_date": "2026-10-29",
    "probability": 100,
    "status": "proposal",
    "is_lead": true
  },
  {
    "id": "s7",
    "profile_id": "p3",
    "client_id": "c25",
    "client_name": "Bahia Life",
    "expected_amount": 10400,
    "expected_date": "2026-10-22",
    "probability": 100,
    "status": "negotiation",
    "is_lead": false
  },
  {
    "id": "s8",
    "profile_id": "p3",
    "client_id": "c30",
    "client_name": "Brasília Med",
    "expected_amount": 9200,
    "expected_date": "2026-10-27",
    "probability": 100,
    "status": "proposal",
    "is_lead": false
  },
  {
    "id": "s9",
    "profile_id": "p3",
    "client_id": null,
    "client_name": "Prospect Atlas",
    "expected_amount": 13200,
    "expected_date": "2026-10-31",
    "probability": 100,
    "status": "proposal",
    "is_lead": true
  }
];

export const seedGoals = [
  {
    "id": "g01",
    "profile_id": "p1",
    "month": "2026-05",
    "goal_amount": 45000
  },
  {
    "id": "g02",
    "profile_id": "p1",
    "month": "2026-06",
    "goal_amount": 50000
  },
  {
    "id": "g03",
    "profile_id": "p1",
    "month": "2026-07",
    "goal_amount": 52000
  },
  {
    "id": "g04",
    "profile_id": "p1",
    "month": "2026-08",
    "goal_amount": 55000
  },
  {
    "id": "g05",
    "profile_id": "p1",
    "month": "2026-09",
    "goal_amount": 58000
  },
  {
    "id": "g06",
    "profile_id": "p1",
    "month": "2026-10",
    "goal_amount": 60000
  },
  {
    "id": "g07",
    "profile_id": "p2",
    "month": "2026-05",
    "goal_amount": 42000
  },
  {
    "id": "g08",
    "profile_id": "p2",
    "month": "2026-06",
    "goal_amount": 48000
  },
  {
    "id": "g09",
    "profile_id": "p2",
    "month": "2026-07",
    "goal_amount": 50000
  },
  {
    "id": "g10",
    "profile_id": "p2",
    "month": "2026-08",
    "goal_amount": 54000
  },
  {
    "id": "g11",
    "profile_id": "p2",
    "month": "2026-09",
    "goal_amount": 60000
  },
  {
    "id": "g12",
    "profile_id": "p2",
    "month": "2026-10",
    "goal_amount": 65000
  },
  {
    "id": "g13",
    "profile_id": "p3",
    "month": "2026-05",
    "goal_amount": 40000
  },
  {
    "id": "g14",
    "profile_id": "p3",
    "month": "2026-06",
    "goal_amount": 45000
  },
  {
    "id": "g15",
    "profile_id": "p3",
    "month": "2026-07",
    "goal_amount": 48000
  },
  {
    "id": "g16",
    "profile_id": "p3",
    "month": "2026-08",
    "goal_amount": 52000
  },
  {
    "id": "g17",
    "profile_id": "p3",
    "month": "2026-09",
    "goal_amount": 56000
  },
  {
    "id": "g18",
    "profile_id": "p3",
    "month": "2026-10",
    "goal_amount": 58000
  }
];

