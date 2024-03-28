angular.module('myApp', []).controller('myController', function ($scope, $filter) {
  // DATA raw 
  $scope.items = [
    { name: 'Item 1', description: 'Description 1' },
    { name: 'Item 2', description: 'Description 2' },
    { name: 'Item 3', description: 'Description 3' },
    // Add more items as needed
  ];


  $scope.employeelist = [
    { id: '01', employee: 'TOP XXX-IGOR B', email: 'AAA@THAIOILGROUP.COM	', department: 'D1', section: 'S2', profile: 'assets/img/team/33.webp', selected: false, seq: 0 },
    { id: '02', employee: 'TOP XXX-CARRY A', email: 'BBB@THAIOILGROUP.COM	', department: 'D2', section: 'S2', profile: 'assets/img/team/34.webp', selected: false, seq: 0 },
    { id: '03', employee: 'TOP XXX-STANLY D', email: 'CCC@THAIOILGROUP.COM	', department: 'D3', section: 'S3', profile: 'assets/img/team/35.webp', selected: false, seq: 0 },
    { id: '04', employee: 'TOP XXX-IGOR C', email: 'DDD@THAIOILGROUP.COM	', department: 'D1', section: 'S1', profile: 'assets/img/team/20.webp', selected: false, seq: 0 },
    { id: '05', employee: 'TOP XXX-CARRY B', email: 'EEE@THAIOILGROUP.COM	', department: 'D2', section: 'S2', profile: 'assets/img/team/18.webp', selected: false, seq: 0 },
    { id: '06', employee: 'TOP XXX-STANLY E', email: 'FFF@THAIOILGROUP.COM	', department: 'D3', section: 'S3', profile: 'assets/img/team/15.webp', selected: false, seq: 0 },
    { id: '07', employee: 'Z XXX-STANLY Z', email: 'GGG@THAIOILGROUP.COM	', department: 'D3', section: 'S1', profile: 'assets/img/team/12.webp', selected: false, seq: 0 },
  ];

  $scope.master_apu = [
    { id: 'A', name: 'A' },
    { id: 'C', name: 'C' },
    { id: 'B', name: 'B' },
    { id: 'D', name: 'D' },
    { id: 'E', name: 'E' },
    { id: 'F', name: 'F' },
  ];

  $scope.node_list = [
    { id: '01', type: 'flow', status: 'On', deviations: 'None', guide_word: 'No Flow', process_deviation: "Incorrect routing – blockage – burst pipe – large leak – equipment failure (C.V., isolation valve, pump, vessel, etc.) – incorrect pressure differential – isolation in error –etc", area_of_application: 'System' },
    { id: '02', type: 'flow', status: 'On', deviations: 'Reverse', guide_word: 'Reverse Flow', process_deviation: "Incorrect pressure differential – two-way flow – emergency venting – incorrect operation – in-line spare equipment –etc.", area_of_application: 'System' },
    { id: '03', type: 'flow', status: 'On', deviations: 'More of', guide_word: 'More/HighFlow', process_deviation: "Increased pumping capacity – reduced delivery head increased suction pressure – static generation under high velocity – pump gland leaks –etc.", area_of_application: 'System' },
    { id: '04', type: 'flow', status: 'On', deviations: 'Less of', guide_word: 'Less/Low Flow', process_deviation: "Line blockage– filter blockage – fouling in vessels – defective pumps – restrictor or orifice plates –etc.", area_of_application: 'System' },
    { id: '05', type: 'flow', status: 'On', deviations: 'Misdirected', guide_word: 'MisdirectedFlow', process_deviation: "Flow directed to stream other than intended due to misalignment of valves –etc.", area_of_application: 'System' },
    { id: '06', type: 'flow', status: 'inactive', deviations: 'More of', guide_word: 'More/High Pressure', process_deviation: "Surge problems (line and flange sizes) – relief philosophy (process / fire etc.) – connection to high pressure system – gas breakthrough (inadequate venting) – defective isolation procedures for relief valves – thermal overpressure – positive displacement pumps – failed closed PCV's – design pressures – relief valve – specifications of pipes – vessels – fittings – instruments – type of relief device and reliability – discharge location – inlet-outlet piping – etc.", area_of_application: 'System' },
    { id: '07', type: 'flow', status: 'inactive', deviations: 'Less of', guide_word: 'MLess/Low Pressure', process_deviation: "Generation of vacuum condition – restricted pump/ compressor suction line – vessel drainage –etc.", area_of_application: 'System' },
    { id: '08', type: 'Temperature', status: 'inactive', deviations: 'More of', guide_word: 'More/High Temperature', process_deviation: "Ambient conditions – fire situation – high than normal temperature – fouled cooler tubes – cooling water temperature wrong –cooling water failure – defective control – heater control failure – internal fires –etc.", area_of_application: 'System' },
    { id: '09', type: 'Temperature', status: 'inactive', deviations: 'Less of', guide_word: 'Less/Low Temperature', process_deviation: "Ambient conditions – reducing pressure – loss of heating – depressurisation of liquefied gas – Joule Thompsoneffect – line freezing –etc.", area_of_application: 'System' },
  ];

  $scope.master_apu = [
    { id: 'E', name: 'E' },
    { id: 'B', name: 'B' },
    { id: 'C', name: 'C' },
    { id: 'F', name: 'F' },
    { id: 'A', name: 'A' },
    { id: 'D', name: 'D' },
  ];

  $scope.master_unit_no = [
    { id: ' Cooling water Unit', name: ' Cooling water Unit', id_apu: 'E', id_bu: ' Cooling water Unit' },
    { id: ' ETP', name: ' ETP', id_apu: 'E', id_bu: ' ETP' },
    { id: ' Nitrogen System Unit', name: ' Nitrogen System Unit', id_apu: 'E', id_bu: ' Nitrogen System Unit' },
    { id: ' Tempered water Unit', name: ' Tempered water Unit', id_apu: 'E', id_bu: ' Tempered water Unit' },
    { id: ' MPU (MP Refining Unit)', name: ' MPU (MP Refining Unit)', id_apu: 'E', id_bu: ' MPU (MP Refining Unit)' },
    { id: ' PDA(Propane Deasphalting unit )', name: ' PDA(Propane Deasphalting unit )', id_apu: 'E', id_bu: ' PDA(Propane Deasphalting unit )' },
    { id: 'ADIP Absorber ', name: 'ADIP Absorber ', id_apu: 'B', id_bu: 'ADIP Absorber ' },
    { id: 'ADIP Treating - 1', name: 'ADIP Treating - 1', id_apu: 'C', id_bu: 'ADIP Treating - 1' },
    { id: 'ADIP Treating - 2 ', name: 'ADIP Treating - 2 ', id_apu: 'C', id_bu: 'ADIP Treating - 2 ' },
    { id: 'ADIP Unit', name: 'ADIP Unit', id_apu: 'E', id_bu: 'ADIP Unit' },
    { id: 'Area Tank C', name: 'Area Tank C', id_apu: 'E', id_bu: 'Area Tank C' },
    { id: 'Benzene – Toluene fractionation II Unit ', name: 'Benzene – Toluene fractionation II Unit ', id_apu: 'F', id_bu: 'Benzene – Toluene fractionation II Unit ' },
    { id: 'Benzene-Toluene fractionation I Unit ', name: 'Benzene-Toluene fractionation I Unit ', id_apu: 'F', id_bu: 'Benzene-Toluene fractionation I Unit ' },
    { id: 'Bitumen (BBU)', name: 'Bitumen (BBU)', id_apu: 'A', id_bu: 'Bitumen (BBU)' },
    { id: 'Bitumen Unit', name: 'Bitumen Unit', id_apu: 'E', id_bu: 'Bitumen Unit' },
    { id: 'Blending Pumps / Loading ', name: 'Blending Pumps / Loading ', id_apu: 'D', id_bu: 'Blending Pumps / Loading ' },
    { id: 'Caustic & Merox Unit', name: 'Caustic & Merox Unit', id_apu: 'A', id_bu: 'Caustic & Merox Unit' },
    { id: 'CCR. Plat - 1 ', name: 'CCR. Plat - 1 ', id_apu: 'B', id_bu: 'CCR. Plat - 1 ' },
    { id: 'CCR.1 Regeneration Section ', name: 'CCR.1 Regeneration Section ', id_apu: 'B', id_bu: 'CCR.1 Regeneration Section ' },
    { id: 'CCR.Plat -2', name: 'CCR.Plat -2', id_apu: 'B', id_bu: 'CCR.Plat -2' },
    { id: 'CO.Boiler Unit ', name: 'CO.Boiler Unit ', id_apu: 'A', id_bu: 'CO.Boiler Unit ' },
    { id: 'Common facilities ', name: 'Common facilities ', id_apu: 'F', id_bu: 'Common facilities ' },
    { id: 'Cooling Water Facilities', name: 'Cooling Water Facilities', id_apu: 'B', id_bu: 'Cooling Water Facilities' },
    { id: 'Cracker Gasoline Hydro-desulphurization', name: 'Cracker Gasoline Hydro-desulphurization', id_apu: 'A', id_bu: 'Cracker Gasoline Hydro-desulphurization' },
    { id: 'Crude Distillation 3 (CDU-3)', name: 'Crude Distillation 3 (CDU-3)', id_apu: 'B', id_bu: 'Crude Distillation 3 (CDU-3)' },
    { id: 'Crude Distillation Unit', name: 'Crude Distillation Unit', id_apu: 'A', id_bu: 'Crude Distillation Unit' },
    { id: 'Crude Distillation Unit 2 (CDU-2)', name: 'Crude Distillation Unit 2 (CDU-2)', id_apu: 'A', id_bu: 'Crude Distillation Unit 2 (CDU-2)' },
    { id: 'Depropanizer', name: 'Depropanizer', id_apu: 'B', id_bu: 'Depropanizer' },
    { id: 'De-Propanizer Unit', name: 'De-Propanizer Unit', id_apu: 'A', id_bu: 'De-Propanizer Unit' },
    { id: 'Desalination', name: 'Desalination', id_apu: 'D', id_bu: 'Desalination' },
    { id: 'Dye Facilities', name: 'Dye Facilities', id_apu: 'D', id_bu: 'Dye Facilities' },
    { id: 'Effluent Collection and Treatment Unit', name: 'Effluent Collection and Treatment Unit', id_apu: 'E', id_bu: 'Effluent Collection and Treatment Unit' },
    { id: 'Effluent Water Treating Plant (ETP)', name: 'Effluent Water Treating Plant (ETP)', id_apu: 'D', id_bu: 'Effluent Water Treating Plant (ETP)' },
    { id: 'Electrical Supply', name: 'Electrical Supply', id_apu: 'B', id_bu: 'Electrical Supply' },
    { id: 'Fire Water System Operation ', name: 'Fire Water System Operation ', id_apu: 'B', id_bu: 'Fire Water System Operation ' },
    { id: 'Flare and Blowdown System', name: 'Flare and Blowdown System', id_apu: 'E', id_bu: 'Flare and Blowdown System' },
    { id: 'Fluid Catalystic Cracking Unit ', name: 'Fluid Catalystic Cracking Unit ', id_apu: 'A', id_bu: 'Fluid Catalystic Cracking Unit ' },
    { id: 'Flushing Oil', name: 'Flushing Oil', id_apu: 'D', id_bu: 'Flushing Oil' },
    { id: 'Flushing Oil System', name: 'Flushing Oil System', id_apu: 'E', id_bu: 'Flushing Oil System' },
    { id: 'Flushing Oil Unit Introduction', name: 'Flushing Oil Unit Introduction', id_apu: 'B', id_bu: 'Flushing Oil Unit Introduction' },
    { id: 'Fuel gas and Fuel oil System', name: 'Fuel gas and Fuel oil System', id_apu: 'E', id_bu: 'Fuel gas and Fuel oil System' },
    { id: 'HCU Sour Water Stripper', name: 'HCU Sour Water Stripper', id_apu: 'C', id_bu: 'HCU Sour Water Stripper' },
    { id: 'HFU (Hyfinishing Unit)', name: 'HFU (Hyfinishing Unit)', id_apu: 'E', id_bu: 'HFU (Hyfinishing Unit)' },
    { id: 'High Vacuum Unit ', name: 'High Vacuum Unit ', id_apu: 'A', id_bu: 'High Vacuum Unit ' },
    { id: 'High Vacuum Unit 2 (HVU-2)', name: 'High Vacuum Unit 2 (HVU-2)', id_apu: 'C', id_bu: 'High Vacuum Unit 2 (HVU-2)' },
    { id: 'High Vacuum Unit 3 (HVU-3) ', name: 'High Vacuum Unit 3 (HVU-3) ', id_apu: 'C', id_bu: 'High Vacuum Unit 3 (HVU-3) ' },
    { id: 'Hot Oil Belt', name: 'Hot Oil Belt', id_apu: 'E', id_bu: 'Hot Oil Belt' },
    { id: 'HVAC for MCB / FAR ', name: 'HVAC for MCB / FAR ', id_apu: 'B', id_bu: 'HVAC for MCB / FAR ' },
    { id: 'Hydrocracking Unit 1 (HCU-1)', name: 'Hydrocracking Unit 1 (HCU-1)', id_apu: 'C', id_bu: 'Hydrocracking Unit 1 (HCU-1)' },
    { id: 'Hydrocracking Unit 2 (HCU-2)', name: 'Hydrocracking Unit 2 (HCU-2)', id_apu: 'C', id_bu: 'Hydrocracking Unit 2 (HCU-2)' },
    { id: 'Hydrodesulphurizer 2 (HDS-2)', name: 'Hydrodesulphurizer 2 (HDS-2)', id_apu: 'A', id_bu: 'Hydrodesulphurizer 2 (HDS-2)' },
    { id: 'Hydrodesulphurizer 3 (HDS-3)', name: 'Hydrodesulphurizer 3 (HDS-3)', id_apu: 'A', id_bu: 'Hydrodesulphurizer 3 (HDS-3)' },
    { id: 'Hydrodesulphurizer-1 (HDS-1) ', name: 'Hydrodesulphurizer-1 (HDS-1) ', id_apu: 'A', id_bu: 'Hydrodesulphurizer-1 (HDS-1) ' },
    { id: 'Hydrogen Distribution System', name: 'Hydrogen Distribution System', id_apu: 'B', id_bu: 'Hydrogen Distribution System' },
    { id: 'Hydrogen Manufacturing  2 (HMU-2)', name: 'Hydrogen Manufacturing  2 (HMU-2)', id_apu: 'A', id_bu: 'Hydrogen Manufacturing  2 (HMU-2)' },
    { id: 'Hydrogen Manufacturing 1 (HMU-1)', name: 'Hydrogen Manufacturing 1 (HMU-1)', id_apu: 'C', id_bu: 'Hydrogen Manufacturing 1 (HMU-1)' },
    { id: 'Hydrogen System Unit', name: 'Hydrogen System Unit', id_apu: 'E', id_bu: 'Hydrogen System Unit' },
    { id: 'Hydrotreater 2(HDT-2)', name: 'Hydrotreater 2(HDT-2)', id_apu: 'A', id_bu: 'Hydrotreater 2(HDT-2)' },
    { id: 'Hydrotreater Unit  (HDT-1)', name: 'Hydrotreater Unit  (HDT-1)', id_apu: 'A', id_bu: 'Hydrotreater Unit  (HDT-1)' },
    { id: 'Inter Connecting Piping', name: 'Inter Connecting Piping', id_apu: 'D', id_bu: 'Inter Connecting Piping' },
    { id: 'Inter Unit Tankage ', name: 'Inter Unit Tankage ', id_apu: 'D', id_bu: 'Inter Unit Tankage ' },
    { id: 'Isomar process unit ', name: 'Isomar process unit ', id_apu: 'F', id_bu: 'Isomar process unit ' },
    { id: 'Isomerization (PENEX, MOLEX)', name: 'Isomerization (PENEX, MOLEX)', id_apu: 'C', id_bu: 'Isomerization (PENEX, MOLEX)' },
    { id: 'Jetty / Marine', name: 'Jetty / Marine', id_apu: 'D', id_bu: 'Jetty / Marine' },
    { id: 'Kerosine Merox Treater (KMT)', name: 'Kerosine Merox Treater (KMT)', id_apu: 'B', id_bu: 'Kerosine Merox Treater (KMT)' },
    { id: 'Lorry Loading', name: 'Lorry Loading', id_apu: 'D', id_bu: 'Lorry Loading' },
    { id: 'LPG Recovery', name: 'LPG Recovery', id_apu: 'A', id_bu: 'LPG Recovery' },
    { id: 'LPG System ', name: 'LPG System ', id_apu: 'D', id_bu: 'LPG System ' },
    { id: 'Marine Loading Unit', name: 'Marine Loading Unit', id_apu: 'E', id_bu: 'Marine Loading Unit' },
    { id: 'Mixed Xylene Unit', name: 'Mixed Xylene Unit', id_apu: 'B', id_bu: 'Mixed Xylene Unit' },
    { id: 'Naphtha Hydrotreater (NHT) ', name: 'Naphtha Hydrotreater (NHT) ', id_apu: 'B', id_bu: 'Naphtha Hydrotreater (NHT) ' },
    { id: 'Nitrogen System', name: 'Nitrogen System', id_apu: 'B', id_bu: 'Nitrogen System' },
    { id: 'Offsite ', name: 'Offsite ', id_apu: 'F', id_bu: 'Offsite ' },
    { id: 'Parex process unit ', name: 'Parex process unit ', id_apu: 'F', id_bu: 'Parex process unit ' },
    { id: 'Plant Air/Instrument Air Facilities ', name: 'Plant Air/Instrument Air Facilities ', id_apu: 'B', id_bu: 'Plant Air/Instrument Air Facilities ' },
    { id: 'Plant and Instrument air Unit', name: 'Plant and Instrument air Unit', id_apu: 'E', id_bu: 'Plant and Instrument air Unit' },
    { id: 'Power Generation Facilities ', name: 'Power Generation Facilities ', id_apu: 'B', id_bu: 'Power Generation Facilities ' },
    { id: 'PX max 1600', name: 'PX max 1600', id_apu: 'A', id_bu: 'PX max 1600' },
    { id: 'Raw and Potable Water System Unit', name: 'Raw and Potable Water System Unit', id_apu: 'E', id_bu: 'Raw and Potable Water System Unit' },
    { id: 'Raw Water Treatment  / Desalt water', name: 'Raw Water Treatment  / Desalt water', id_apu: 'B', id_bu: 'Raw Water Treatment  / Desalt water' },
    { id: 'Refinery Fuel Oil/Fuel Gas System ', name: 'Refinery Fuel Oil/Fuel Gas System ', id_apu: 'B', id_bu: 'Refinery Fuel Oil/Fuel Gas System ' },
    { id: 'Road Loading Unit', name: 'Road Loading Unit', id_apu: 'E', id_bu: 'Road Loading Unit' },
    { id: 'SDU (Solvent Dewaxing Unit)', name: 'SDU (Solvent Dewaxing Unit)', id_apu: 'E', id_bu: 'SDU (Solvent Dewaxing Unit)' },
    { id: 'Shell sulfolane process unit ', name: 'Shell sulfolane process unit ', id_apu: 'F', id_bu: 'Shell sulfolane process unit ' },
    { id: 'Slops Header and Slop Recovery System', name: 'Slops Header and Slop Recovery System', id_apu: 'E', id_bu: 'Slops Header and Slop Recovery System' },
    { id: 'Sour Water Stripper Unit', name: 'Sour Water Stripper Unit', id_apu: 'E', id_bu: 'Sour Water Stripper Unit' },
    { id: 'Sour Water Stripping Unit (SWS)', name: 'Sour Water Stripping Unit (SWS)', id_apu: 'A', id_bu: 'Sour Water Stripping Unit (SWS)' },
    { id: 'Sour Water Stripping Unit (SWS) ', name: 'Sour Water Stripping Unit (SWS) ', id_apu: 'C', id_bu: 'Sour Water Stripping Unit (SWS) ' },
    { id: 'Sour Water Stripping Unit (TOC-1/2)', name: 'Sour Water Stripping Unit (TOC-1/2)', id_apu: 'A', id_bu: 'Sour Water Stripping Unit (TOC-1/2)' },
    { id: 'Splitter Unit   ', name: 'Splitter Unit   ', id_apu: 'A', id_bu: 'Splitter Unit   ' },
    { id: 'SRU (Sulphur Recovery Unit )', name: 'SRU (Sulphur Recovery Unit )', id_apu: 'E', id_bu: 'SRU (Sulphur Recovery Unit )' },
    { id: 'Stabilizer / Splitter', name: 'Stabilizer / Splitter', id_apu: 'A', id_bu: 'Stabilizer / Splitter' },
    { id: 'Stabilizer Unit ', name: 'Stabilizer Unit ', id_apu: 'A', id_bu: 'Stabilizer Unit ' },
    { id: 'Steam Distribution ', name: 'Steam Distribution ', id_apu: 'B', id_bu: 'Steam Distribution ' },
    { id: 'Steam Generation ', name: 'Steam Generation ', id_apu: 'B', id_bu: 'Steam Generation ' },
    { id: 'Steam Generation Unit', name: 'Steam Generation Unit', id_apu: 'E', id_bu: 'Steam Generation Unit' },
    { id: 'Submarine/Crude Discharge Line', name: 'Submarine/Crude Discharge Line', id_apu: 'D', id_bu: 'Submarine/Crude Discharge Line' },
    { id: 'Sulphur Recovery Unit 1 (SRU-1)', name: 'Sulphur Recovery Unit 1 (SRU-1)', id_apu: 'C', id_bu: 'Sulphur Recovery Unit 1 (SRU-1)' },
    { id: 'Sulphur Recovery Unit 2 (SRU-2)', name: 'Sulphur Recovery Unit 2 (SRU-2)', id_apu: 'C', id_bu: 'Sulphur Recovery Unit 2 (SRU-2)' },
    { id: 'Sulphur Recovery Unit 3 (SRU-3)', name: 'Sulphur Recovery Unit 3 (SRU-3)', id_apu: 'C', id_bu: 'Sulphur Recovery Unit 3 (SRU-3)' },
    { id: 'Sulphur Recovery Unit 4 (SRU-4)', name: 'Sulphur Recovery Unit 4 (SRU-4)', id_apu: 'C', id_bu: 'Sulphur Recovery Unit 4 (SRU-4)' },
    { id: 'Tankage Unit                                   ', name: 'Tankage Unit                                   ', id_apu: 'E', id_bu: 'Tankage Unit                                   ' },
    { id: 'Tempered Water System', name: 'Tempered Water System', id_apu: 'B', id_bu: 'Tempered Water System' },
    { id: 'Thermal Cracker Unit (TCU)', name: 'Thermal Cracker Unit (TCU)', id_apu: 'A', id_bu: 'Thermal Cracker Unit (TCU)' },
    { id: 'Utility  ', name: 'Utility  ', id_apu: 'F', id_bu: 'Utility  ' },
    { id: 'VDU (vacuum Distillation unit)', name: 'VDU (vacuum Distillation unit)', id_apu: 'E', id_bu: 'VDU (vacuum Distillation unit)' },
    { id: 'Water Treating (Demineralization) / BFW system', name: 'Water Treating (Demineralization) / BFW system', id_apu: 'B', id_bu: 'Water Treating (Demineralization) / BFW system' },
    { id: 'Xylene fractionation unit ', name: 'Xylene fractionation unit ', id_apu: 'F', id_bu: 'Xylene fractionation unit ' },
  ];

  $scope.master_business_unit = [
    { id: ' Cooling water Unit', name: ' Cooling water Unit', id_apu: 'E' },
    { id: ' ETP', name: ' ETP', id_apu: 'E' },
    { id: ' Nitrogen System Unit', name: ' Nitrogen System Unit', id_apu: 'E' },
    { id: ' Tempered water Unit', name: ' Tempered water Unit', id_apu: 'E' },
    { id: ' MPU (MP Refining Unit)', name: ' MPU (MP Refining Unit)', id_apu: 'E' },
    { id: ' PDA(Propane Deasphalting unit )', name: ' PDA(Propane Deasphalting unit )', id_apu: 'E' },
    { id: 'ADIP Absorber ', name: 'ADIP Absorber ', id_apu: 'B' },
    { id: 'ADIP Treating - 1', name: 'ADIP Treating - 1', id_apu: 'C' },
    { id: 'ADIP Treating - 2 ', name: 'ADIP Treating - 2 ', id_apu: 'C' },
    { id: 'ADIP Unit', name: 'ADIP Unit', id_apu: 'E' },
    { id: 'Area Tank C', name: 'Area Tank C', id_apu: 'E' },
    { id: 'Benzene – Toluene fractionation II Unit ', name: 'Benzene – Toluene fractionation II Unit ', id_apu: 'F' },
    { id: 'Benzene-Toluene fractionation I Unit ', name: 'Benzene-Toluene fractionation I Unit ', id_apu: 'F' },
    { id: 'Bitumen (BBU)', name: 'Bitumen (BBU)', id_apu: 'A' },
    { id: 'Bitumen Unit', name: 'Bitumen Unit', id_apu: 'E' },
    { id: 'Blending Pumps / Loading ', name: 'Blending Pumps / Loading ', id_apu: 'D' },
    { id: 'Caustic & Merox Unit', name: 'Caustic & Merox Unit', id_apu: 'A' },
    { id: 'CCR. Plat - 1 ', name: 'CCR. Plat - 1 ', id_apu: 'B' },
    { id: 'CCR.1 Regeneration Section ', name: 'CCR.1 Regeneration Section ', id_apu: 'B' },
    { id: 'CCR.Plat -2', name: 'CCR.Plat -2', id_apu: 'B' },
    { id: 'CO.Boiler Unit ', name: 'CO.Boiler Unit ', id_apu: 'A' },
    { id: 'Common facilities ', name: 'Common facilities ', id_apu: 'F' },
    { id: 'Cooling Water Facilities', name: 'Cooling Water Facilities', id_apu: 'B' },
    { id: 'Cracker Gasoline Hydro-desulphurization', name: 'Cracker Gasoline Hydro-desulphurization', id_apu: 'A' },
    { id: 'Crude Distillation 3 (CDU-3)', name: 'Crude Distillation 3 (CDU-3)', id_apu: 'B' },
    { id: 'Crude Distillation Unit', name: 'Crude Distillation Unit', id_apu: 'A' },
    { id: 'Crude Distillation Unit 2 (CDU-2)', name: 'Crude Distillation Unit 2 (CDU-2)', id_apu: 'A' },
    { id: 'Depropanizer', name: 'Depropanizer', id_apu: 'B' },
    { id: 'De-Propanizer Unit', name: 'De-Propanizer Unit', id_apu: 'A' },
    { id: 'Desalination', name: 'Desalination', id_apu: 'D' },
    { id: 'Dye Facilities', name: 'Dye Facilities', id_apu: 'D' },
    { id: 'Effluent Collection and Treatment Unit', name: 'Effluent Collection and Treatment Unit', id_apu: 'E' },
    { id: 'Effluent Water Treating Plant (ETP)', name: 'Effluent Water Treating Plant (ETP)', id_apu: 'D' },
    { id: 'Electrical Supply', name: 'Electrical Supply', id_apu: 'B' },
    { id: 'Fire Water System Operation ', name: 'Fire Water System Operation ', id_apu: 'B' },
    { id: 'Flare and Blowdown System', name: 'Flare and Blowdown System', id_apu: 'E' },
    { id: 'Fluid Catalystic Cracking Unit ', name: 'Fluid Catalystic Cracking Unit ', id_apu: 'A' },
    { id: 'Flushing Oil', name: 'Flushing Oil', id_apu: 'D' },
    { id: 'Flushing Oil System', name: 'Flushing Oil System', id_apu: 'E' },
    { id: 'Flushing Oil Unit Introduction', name: 'Flushing Oil Unit Introduction', id_apu: 'B' },
    { id: 'Fuel gas and Fuel oil System', name: 'Fuel gas and Fuel oil System', id_apu: 'E' },
    { id: 'HCU Sour Water Stripper', name: 'HCU Sour Water Stripper', id_apu: 'C' },
    { id: 'HFU (Hyfinishing Unit)', name: 'HFU (Hyfinishing Unit)', id_apu: 'E' },
    { id: 'High Vacuum Unit ', name: 'High Vacuum Unit ', id_apu: 'A' },
    { id: 'High Vacuum Unit 2 (HVU-2)', name: 'High Vacuum Unit 2 (HVU-2)', id_apu: 'C' },
    { id: 'High Vacuum Unit 3 (HVU-3) ', name: 'High Vacuum Unit 3 (HVU-3) ', id_apu: 'C' },
    { id: 'Hot Oil Belt', name: 'Hot Oil Belt', id_apu: 'E' },
    { id: 'HVAC for MCB / FAR ', name: 'HVAC for MCB / FAR ', id_apu: 'B' },
    { id: 'Hydrocracking Unit 1 (HCU-1)', name: 'Hydrocracking Unit 1 (HCU-1)', id_apu: 'C' },
    { id: 'Hydrocracking Unit 2 (HCU-2)', name: 'Hydrocracking Unit 2 (HCU-2)', id_apu: 'C' },
    { id: 'Hydrodesulphurizer 2 (HDS-2)', name: 'Hydrodesulphurizer 2 (HDS-2)', id_apu: 'A' },
    { id: 'Hydrodesulphurizer 3 (HDS-3)', name: 'Hydrodesulphurizer 3 (HDS-3)', id_apu: 'A' },
    { id: 'Hydrodesulphurizer-1 (HDS-1) ', name: 'Hydrodesulphurizer-1 (HDS-1) ', id_apu: 'A' },
    { id: 'Hydrogen Distribution System', name: 'Hydrogen Distribution System', id_apu: 'B' },
    { id: 'Hydrogen Manufacturing  2 (HMU-2)', name: 'Hydrogen Manufacturing  2 (HMU-2)', id_apu: 'A' },
    { id: 'Hydrogen Manufacturing 1 (HMU-1)', name: 'Hydrogen Manufacturing 1 (HMU-1)', id_apu: 'C' },
    { id: 'Hydrogen System Unit', name: 'Hydrogen System Unit', id_apu: 'E' },
    { id: 'Hydrotreater 2(HDT-2)', name: 'Hydrotreater 2(HDT-2)', id_apu: 'A' },
    { id: 'Hydrotreater Unit  (HDT-1)', name: 'Hydrotreater Unit  (HDT-1)', id_apu: 'A' },
    { id: 'Inter Connecting Piping', name: 'Inter Connecting Piping', id_apu: 'D' },
    { id: 'Inter Unit Tankage ', name: 'Inter Unit Tankage ', id_apu: 'D' },
    { id: 'Isomar process unit ', name: 'Isomar process unit ', id_apu: 'F' },
    { id: 'Isomerization (PENEX, MOLEX)', name: 'Isomerization (PENEX, MOLEX)', id_apu: 'C' },
    { id: 'Jetty / Marine', name: 'Jetty / Marine', id_apu: 'D' },
    { id: 'Kerosine Merox Treater (KMT)', name: 'Kerosine Merox Treater (KMT)', id_apu: 'B' },
    { id: 'Lorry Loading', name: 'Lorry Loading', id_apu: 'D' },
    { id: 'LPG Recovery', name: 'LPG Recovery', id_apu: 'A' },
    { id: 'LPG System ', name: 'LPG System ', id_apu: 'D' },
    { id: 'Marine Loading Unit', name: 'Marine Loading Unit', id_apu: 'E' },
    { id: 'Mixed Xylene Unit', name: 'Mixed Xylene Unit', id_apu: 'B' },
    { id: 'Naphtha Hydrotreater (NHT) ', name: 'Naphtha Hydrotreater (NHT) ', id_apu: 'B' },
    { id: 'Nitrogen System', name: 'Nitrogen System', id_apu: 'B' },
    { id: 'Offsite ', name: 'Offsite ', id_apu: 'F' },
    { id: 'Parex process unit ', name: 'Parex process unit ', id_apu: 'F' },
    { id: 'Plant Air/Instrument Air Facilities ', name: 'Plant Air/Instrument Air Facilities ', id_apu: 'B' },
    { id: 'Plant and Instrument air Unit', name: 'Plant and Instrument air Unit', id_apu: 'E' },
    { id: 'Power Generation Facilities ', name: 'Power Generation Facilities ', id_apu: 'B' },
    { id: 'PX max 1600', name: 'PX max 1600', id_apu: 'A' },
    { id: 'Raw and Potable Water System Unit', name: 'Raw and Potable Water System Unit', id_apu: 'E' },
    { id: 'Raw Water Treatment  / Desalt water', name: 'Raw Water Treatment  / Desalt water', id_apu: 'B' },
    { id: 'Refinery Fuel Oil/Fuel Gas System ', name: 'Refinery Fuel Oil/Fuel Gas System ', id_apu: 'B' },
    { id: 'Road Loading Unit', name: 'Road Loading Unit', id_apu: 'E' },
    { id: 'SDU (Solvent Dewaxing Unit)', name: 'SDU (Solvent Dewaxing Unit)', id_apu: 'E' },
    { id: 'Shell sulfolane process unit ', name: 'Shell sulfolane process unit ', id_apu: 'F' },
    { id: 'Slops Header and Slop Recovery System', name: 'Slops Header and Slop Recovery System', id_apu: 'E' },
    { id: 'Sour Water Stripper Unit', name: 'Sour Water Stripper Unit', id_apu: 'E' },
    { id: 'Sour Water Stripping Unit (SWS)', name: 'Sour Water Stripping Unit (SWS)', id_apu: 'A' },
    { id: 'Sour Water Stripping Unit (SWS) ', name: 'Sour Water Stripping Unit (SWS) ', id_apu: 'C' },
    { id: 'Sour Water Stripping Unit (TOC-1/2)', name: 'Sour Water Stripping Unit (TOC-1/2)', id_apu: 'A' },
    { id: 'Splitter Unit   ', name: 'Splitter Unit   ', id_apu: 'A' },
    { id: 'SRU (Sulphur Recovery Unit )', name: 'SRU (Sulphur Recovery Unit )', id_apu: 'E' },
    { id: 'Stabilizer / Splitter', name: 'Stabilizer / Splitter', id_apu: 'A' },
    { id: 'Stabilizer Unit ', name: 'Stabilizer Unit ', id_apu: 'A' },
    { id: 'Steam Distribution ', name: 'Steam Distribution ', id_apu: 'B' },
    { id: 'Steam Generation ', name: 'Steam Generation ', id_apu: 'B' },
    { id: 'Steam Generation Unit', name: 'Steam Generation Unit', id_apu: 'E' },
    { id: 'Submarine/Crude Discharge Line', name: 'Submarine/Crude Discharge Line', id_apu: 'D' },
    { id: 'Sulphur Recovery Unit 1 (SRU-1)', name: 'Sulphur Recovery Unit 1 (SRU-1)', id_apu: 'C' },
    { id: 'Sulphur Recovery Unit 2 (SRU-2)', name: 'Sulphur Recovery Unit 2 (SRU-2)', id_apu: 'C' },
    { id: 'Sulphur Recovery Unit 3 (SRU-3)', name: 'Sulphur Recovery Unit 3 (SRU-3)', id_apu: 'C' },
    { id: 'Sulphur Recovery Unit 4 (SRU-4)', name: 'Sulphur Recovery Unit 4 (SRU-4)', id_apu: 'C' },
    { id: 'Tankage Unit                                   ', name: 'Tankage Unit                                   ', id_apu: 'E' },
    { id: 'Tempered Water System', name: 'Tempered Water System', id_apu: 'B' },
    { id: 'Thermal Cracker Unit (TCU)', name: 'Thermal Cracker Unit (TCU)', id_apu: 'A' },
    { id: 'Utility  ', name: 'Utility  ', id_apu: 'F' },
    { id: 'VDU (vacuum Distillation unit)', name: 'VDU (vacuum Distillation unit)', id_apu: 'E' },
    { id: 'Water Treating (Demineralization) / BFW system', name: 'Water Treating (Demineralization) / BFW system', id_apu: 'B' },
    { id: 'Xylene fractionation unit ', name: 'Xylene fractionation unit ', id_apu: 'F' },
  ];
  // DATA raw



  $scope.complete = function (string) {

    $scope.hidethis = false;
    var output = [];
    angular.forEach($scope.employeelist, function (members) {
      if (members.email.toLowerCase().indexOf(string.toLowerCase()) >= 0 || members.employee.toLowerCase().indexOf(string.toLowerCase()) >= 0) {
        output.push(members.employee);
      }
    });
    $scope.filterMember = output;

  }

  $scope.fillTextbox = function (string) {
    $scope.members = string;
    $scope.hidethis = true;
  }



  $scope.filterOptionSection = '';
  $scope.filterOption = '';
  $scope.searchQuery = '';

  $scope.selectedDataOnbehalf = {};


  $scope.filteredData = [];

  $scope.selectedData = {};


  // $scope.selectedItems = [];

  $scope.updateSelectedItems = function () {
    $scope.selectedData = $scope.employeelist.filter(function (item) {
      return item.selected;
    });
  };

  $scope.filterDataSection = function () {
    if ($scope.filterOptionSection === '') {
      $scope.filteredData = $scope.employeelist;
    } else {
      $scope.filteredData = $filter('filter')($scope.employeelist, { section: $scope.filterOptionSection });
    }

  };

  $scope.filterDataDepartment = function () {
    if ($scope.filterOption === '') {
      $scope.filteredData = $scope.employeelist;
    } else {
      $scope.filteredData = $filter('filter')($scope.employeelist, { department: $scope.filterOption });
    }

  };

  $scope.filterDataWord = function () {
    // $scope.filteredData = $filter('filter')($scope.employeelist,{ 
    //   employee: $scope.searchQuery,
    //   email: $scope.searchQuery
    // });

    $scope.filteredData = $filter('filter')($scope.employeelist, function (item) {
      var nameMatch = item.employee.toLowerCase().indexOf($scope.searchQuery.toLowerCase()) !== -1;
      var emailMatch = item.email.toLowerCase().indexOf($scope.searchQuery.toLowerCase()) !== -1;
      return nameMatch || emailMatch;
    });

  }

  $scope.selectData = function (item) {
    $scope.selectedData = item;
  };

  $scope.selectDataOnbeHlaf = function (item) {
    $scope.selectedDataOnbehalf = item;
  };

  $scope.resetSsion = function () {
    $scope.selectedData = '';
    $scope.selectedDataOnbehalf = '';
    document.getElementById('members').value = '';
    document.getElementById('nameOnbeHalf').value = '';
  };


  $scope.filterDataSection(); // Initial data filtering

  $scope.filterDataDepartment(); // Initial data filtering

  $scope.filterDataWord(); // Initial data filtering

  // <===== Node loist zone function  ====== >


  $scope.inputGroupsDeviation = [];

  $scope.inputGroupsCauses = [];

  $scope.inputGroupsConsequences = [];

  //  add Function 


  $scope.addDeviationGroup = function () {
    var newInputGroup = { value: '' };
    $scope.inputGroupsDeviation.push(newInputGroup);
  };

  $scope.addCausesGroup = function () {
    var newInputGroup = { value: '' };
    $scope.inputGroupsCauses.push(newInputGroup);
  };

  $scope.addConsequencesGroup = function () {
    var newInputGroup = { value: '' };
    $scope.inputGroupsConsequences.push(newInputGroup);
  };


  //  Delete function 


  $scope.deleteDeviation = function (index) {
    $scope.inputGroupsDeviation.splice(index, 1);
  };

  $scope.deleteCauses = function (index) {
    $scope.inputGroupsCauses.splice(index, 1);
  };

  $scope.deleteConsequencess = function (index) {
    $scope.inputGroupsConsequences.splice(index, 1);
  };




  $scope.filteredDataNode = [];

  $scope.filterNodeStatus = '';

  $scope.searchNode = '';
  $scope.searchNodeGuide = '';
  $scope.searchNodeProcess = '';
  $scope.searchNodeArea = '';




  $scope.filterNode = function () {
    $scope.filteredDataNode = $filter('filter')($scope.node_list, { deviations: $scope.searchNode });
  };

  $scope.filterNodeGuideword = function () {
    $scope.filteredDataNode = $filter('filter')($scope.node_list, { guide_word: $scope.searchNodeGuide });
  };

  $scope.filterNodeProcess = function () {
    $scope.filteredDataNode = $filter('filter')($scope.node_list, { process_deviation: $scope.searchNodeProcess });
  };

  $scope.filterNodeArea = function () {
    $scope.filteredDataNode = $filter('filter')($scope.node_list, { area_of_application: $scope.searchNodeArea });
  };

  $scope.filterNodeActive = function () {
    if ($scope.filterNodeStatus === '') {
      $scope.filteredDataNode = $scope.node_list;
    } else {
      $scope.filteredDataNode = $filter('filter')($scope.node_list, { status: $scope.filterNodeStatus });
    }

  };


  $scope.filterNode();

  $scope.filterNodeGuideword();

  $scope.filterNodeProcess();

  $scope.filterNodeArea();

  $scope.filterNodeActive();

  // <===== Node loist zone function  ======>  




  // <===== (Kul)Session zone function  ======>  
  $scope.DataSession = [{ no: 1, seq: 1, session_date: '', session_time_start: '', session_time_end: '' },];
  //$scope.selectDataEmpSession = [];
  $scope.MaxSeqDataSession = 1;
  $scope.selectDataSession = 1;

  $scope.addDataSession = function (seq) {

    $scope.MaxSeqDataSession = ($scope.MaxSeqDataSession) + 1;
    var xValues = $scope.MaxSeqDataSession;
    var newInput = { seq: xValues, session_date: '', session_time_start: '', session_time_end: '' };

    $scope.DataSession.push(newInput);

    $scope.selectDataSession = xValues;
    running_no_session();

  }
  $scope.copyDataSession = function (seq) {

    $scope.MaxSeqDataSession = ($scope.MaxSeqDataSession) + 1;
    var xValues = $scope.MaxSeqDataSession;
    var newInput = { seq: xValues };

    var arr = $filter('filter')($scope.DataSession, function (item) {
      return (item.seq == seq);
    });

    for (let i = 0; i < arr.length; i++) {
      var newInput = {
        seq: xValues
        , session_date: arr[i].session_date
        , session_time_start: arr[i].session_time_start
        , session_time_end: arr[i].session_time_end
      };
    };
    $scope.DataSession.push(newInput);

    var arr = $filter('filter')($scope.selectDataEmpSession, { seq: seq });
    for (let i = 0; i < arr.length; i++) {
      var newInput = {
        id: arr[i].id
        , employee: arr[i].employee
        , email: arr[i].email
        , department: arr[i].department
        , section: ''
        , profile: arr[i].profile
        , selected: false
        , seq: xValues
      };

      $scope.selectDataEmpSession.push(newInput);

    }
    running_no_session();

    $scope.selectDataSession = xValues;

  }
  $scope.removeDataSession = function (seq) {

    $scope.DataSession = $filter('filter')($scope.DataSession, function (item) {
      return !(item.seq == seq);
    });

    if ($scope.DataSession.length === 0) {
      $scope.addDataSession();
    }
    running_no_session();
  };
  function running_no_session() {
    for (let i = 0; i < $scope.DataSession.length; i++) {
      $scope.DataSession[i].no = (i + 1);
    };

  }
  $scope.openModalEmployeeCheck = function (seq) {
    $scope.selectDataSession = seq;
    //alert($scope.selectDataSession);
    var arr = $scope.employeelist;
    for (let i = 0; i < arr.length; i++) {

      try {

        var ar_check = $filter('filter')($scope.selectDataEmpSession, { seq: seq, id: arr[i].id });

        if (ar_check.length > 0) {
          $scope.employeelist[i].selected = true;
        } else {
          $scope.employeelist[i].selected = false;
        }
      } catch (e) { return; }

    };
  };

  $scope.filteredDataEmpSession = function () {
    //alert($scope.selectDataSession);

    var arr = $filter('filter')($scope.employeelist, { selected: true });
    try {
      if ($scope.selectDataEmpSession.length === 0) {
        $scope.selectDataEmpSession = [];
      }
    } catch (e) {
      $scope.selectDataEmpSession = [];
    }

    var seq = $scope.selectDataSession;
    for (let i = 0; i < arr.length; i++) {

      var ar_check = $filter('filter')($scope.selectDataEmpSession, { seq: seq, id: arr[i].id });
      if (ar_check.length > 0) { continue; }

      var newInput = {
        id: arr[i].id
        , employee: arr[i].employee
        , email: arr[i].email
        , department: arr[i].department
        , section: ''
        , profile: arr[i].profile
        , selected: false
        , seq: $scope.selectDataSession
      };

      $scope.selectDataEmpSession.push(newInput);

    }

    $apply();

  };
  $scope.removeDataEmpSession = function (id, seq_session) {
    $scope.selectDataEmpSession = $filter('filter')($scope.selectDataEmpSession, function (item) {
      return !(item.id == id && item.seq == seq_session);
    });
  };
  function $apply(expr) {
    try {
      return $eval(expr);
    } catch (e) {
      $exceptionHandler(e);
    } finally {
      $root.$digest();
    }
  }

  // <===== (Kul)Drawing & Reference zone function  ======>  
  $scope.DataDrawingDoc = [{ no: 1, seq: 1, document_name: 'xx1', drawing_no: 'no1', document_file: '', comment: '' },];
  //$scope.selectDataEmpSession = [];
  $scope.MaxSeqDataDrawingDoc = 1;
  $scope.selectDataDrawingDoc = 1;


  $scope.addDrawingDoc = function (seq) {

    $scope.MaxSeqDataDrawingDoc = ($scope.MaxSeqDataDrawingDoc) + 1;
    var xValues = $scope.MaxSeqDataDrawingDoc;

    var newInput = { seq: xValues, document_name: '', drawing_no: '', document_file: '', comment: '' };

    $scope.DataDrawingDoc.push(newInput);

    $scope.selectDrawingDoc = xValues;

    running_no_drawing();
  }
  $scope.copyDrawingDoc = function (seq) {

    $scope.MaxSeqDataDrawingDoc = ($scope.MaxSeqDataDrawingDoc) + 1;
    var xValues = $scope.MaxSeqDataDrawingDoc;
    var newInput = { seq: xValues };

    var arr = $filter('filter')($scope.DataDrawingDoc, function (item) {
      return (item.seq == seq);
    });

    for (let i = 0; i < arr.length; i++) {
      var newInput = {
        seq: xValues
        , document_name: arr[i].document_name
        , drawing_no: arr[i].drawing_no
        , document_file: arr[i].document_file
        , comment: arr[i].comment
      };
    };
    $scope.DataDrawingDoc.push(newInput);

    running_no_drawing();
    $scope.selectDrawingDoc = xValues;

  }
  $scope.removeDrawingDoc = function (seq) {

    $scope.DataDrawingDoc = $filter('filter')($scope.DataDrawingDoc, function (item) {
      return !(item.seq == seq);
    });

    if ($scope.DataDrawingDoc.length === 0) {
      $scope.addDrawingDoc();
    }
    running_no_drawing();
  };

  function running_no_drawing() {
    for (let i = 0; i < $scope.DataDrawingDoc.length; i++) {
      $scope.DataDrawingDoc[i].no = (i + 1);
    };
  }


  // <===== (Kul) Node List zone function  ======>  

  $scope.GuideWordslist = [
    { id: '1', type: 'Flow', deviations: 'None', guidewords: 'No Flow', process: 'Incorrect routing – blockage – burst pipe – large leak – equipment failure (C.V., isolation valve, pump, vessel, etc.) – incorrect pressure differential – isolation in error –etc', area: '', selected: true, seq: 0 },
    { id: '2', type: 'Flow', deviations: 'Reverse', guidewords: 'Reverse Flow', process: 'Incorrect pressure differential – two-way flow – emergency venting – incorrect operation – in-line spare equipment –etc.', area: 'System', selected: true, seq: 0 },
    { id: '3', type: 'Flow', deviations: 'More of', guidewords: 'More/HighFlow', process: 'Increased pumping capacity – reduced delivery head increased suction pressure – static generation under high velocity – pump gland leaks –etc.', area: 'System', selected: true, seq: 0 },
    { id: '4', type: 'Flow', deviations: 'Less of', guidewords: 'Less/Low Flow', process: 'Line blockage– filter blockage – fouling in vessels – defective pumps – restrictor or orifice plates –etc.', area: 'System', selected: true, seq: 0 },
    { id: '5', type: 'Flow', deviations: 'Misdirected', guidewords: 'MisdirectedFlow', process: 'Flow directed to stream other than intended due to misalignment of valves –etc.', area: 'System', selected: true, seq: 0 },
    { id: '6', type: 'Flow', deviations: 'More of', guidewords: 'More/High Pressure', process: "Surge problems (line and flange sizes) – relief philosophy (process / fire etc.) – connection to high pressure system – gas breakthrough (inadequate venting) – defective isolation procedures for relief valves – thermal overpressure – positive displacement pumps – failed closed PCV's – design pressures – relief valve – specifications of pipes – vessels – fittings – instruments – type of relief device and reliability – discharge location – inlet- outlet piping – etc.", area: 'System', selected: false, seq: 0 },
    { id: '7', type: 'Flow', deviations: 'Less of', guidewords: 'MLess/Low Pressure', process: 'Generation of vacuum condition – restricted pump/ compressor suction line – vessel drainage –etc.', area: 'System', selected: false, seq: 0 },
    { id: '8', type: 'Temperature', deviations: 'More of', guidewords: 'More/High Temperature', process: 'Ambient conditions – fire situation – high than normal temperature – fouled cooler tubes – cooling water temperature wrong –cooling water failure – defective control – heater control failure – internal fires –etc.', area: '', selected: false, seq: 0 },
    { id: '9', type: 'Temperature', deviations: 'Less of', guidewords: 'Less/Low Temperature', process: 'Ambient conditions – reducing pressure – loss of heating – depressurisation of liquefied gas – Joule Thompsoneffect – line freezing –etc.', area: 'System', selected: false, seq: 0 },

  ];
  $scope.DataNodeList = [{ no: 1, seq: 1, node_text: 'node xx1', design_intent: '', design_conditions: '', operating_conditions: '', node_boundary: '', node_drawing: '' },];
  //$scope.selectDataGuideWords = [];
  $scope.MaxSeqDataNodeList = 1;
  $scope.selectDataNodeList = 1;

  $scope.addDataNodeList = function (seq) {

    $scope.MaxSeqDataNodeList = ($scope.MaxSeqDataNodeList) + 1;
    var xValues = $scope.MaxSeqDataNodeList;
    var newInput = { seq: xValues, node_text: '', design_intent: '', design_conditions: '', operating_conditions: '', node_boundary: '', node_drawing: '' };

    $scope.DataNodeList.push(newInput);

    $scope.selectDataNodeList = xValues;
    running_no_nodelist();

    $scope.addDataNodeDrawing("", xValues);

  }
  $scope.copyDataNodeList = function (seq) {

    $scope.MaxSeqDataNodeList = ($scope.MaxSeqDataNodeList) + 1;
    var xValues = $scope.MaxSeqDataNodeList;
    var newInput = { seq: xValues };

    var arr = $filter('filter')($scope.DataNodeList, function (item) {
      return (item.seq == seq);
    });

    for (let i = 0; i < arr.length; i++) {
      var newInput = {
        seq: xValues
        , node_text: arr[i].node_text
        , design_intent: arr[i].design_intent
        , design_conditions: arr[i].design_conditions
        , operating_conditions: arr[i].operating_conditions
        , node_boundary: arr[i].node_boundary
        , node_drawing: arr[i].node_drawing
      };
    };
    $scope.DataNodeList.push(newInput);

    running_no_nodelist();

    $scope.selectDataNodeList = xValues;

    try {
      if (false) {
        var arr = $filter('filter')($scope.selectDataGuideWords, { seq: seq });
        for (let i = 0; i < arr.length; i++) {
          var newInput = {
            id: arr[i].id
            , guidewords: arr[i].guidewords
            , deviations: arr[i].deviations
            , process: arr[i].process
            , area: arr[i].area
            , selected: false
            , seq: xValues
          };

          $scope.selectDataGuideWords.push(newInput);

        }
      }
    } catch (e) { alert("selectDataGuideWords:" + e); }

    var arr = $filter('filter')($scope.selectDataNodeDrawing, { seq_node: seq });
    for (let i = 0; i < arr.length; i++) {
      $scope.MaxSeqDataNodeDrawing = ($scope.MaxSeqDataNodeDrawing) + 1;
      var xMaxSeqDataNodeDrawing = $scope.MaxSeqDataNodeDrawing;
      var newInput = {
        seq_node: xValues
        , seq_drawing: arr[i].seq_drawing
        , seq: xMaxSeqDataNodeDrawing
      };
      $scope.selectDataNodeDrawing.push(newInput);
    }

  }
  $scope.removeDataNodeList = function (seq) {

    $scope.DataNodeList = $filter('filter')($scope.DataNodeList, function (item) {
      return !(item.seq == seq);
    });

    if ($scope.DataNodeList.length === 0) {
      $scope.addDataNodeList();
    }
    running_no_nodelist();
  };
  function running_no_nodelist() {
    for (let i = 0; i < $scope.DataNodeList.length; i++) {
      $scope.DataNodeList[i].no = (i + 1);
    };

  }
  $scope.openModalEmployeeCheck = function (seq) {
    $scope.selectDataNodeList = seq;
    //alert($scope.selectDataNodeList);
    var arr = $scope.GuideWordslist;
    for (let i = 0; i < arr.length; i++) {

      try {

        var ar_check = $filter('filter')($scope.selectDataGuideWords, { seq: seq, id: arr[i].id });

        if (ar_check.length > 0) {
          $scope.GuideWordslist[i].selected = true;
        } else {
          $scope.GuideWordslist[i].selected = false;

        }
      } catch (e) { return; }

    };
  };
  $scope.filteredDataGuideWords = function () {
    //alert($scope.selectDataNodeList);

    var arr = $filter('filter')($scope.GuideWordslist, { selected: true });
    try {
      if ($scope.selectDataGuideWords.length === 0) {
        $scope.selectDataGuideWords = [];
      }
    } catch (e) {
      $scope.selectDataGuideWords = [];
    }

    var seq = $scope.selectDataNodeList;
    for (let i = 0; i < arr.length; i++) {

      var ar_check = $filter('filter')($scope.selectDataGuideWords, { seq: seq, id: arr[i].id });
      if (ar_check.length > 0) { continue; }

      var newInput = {
        id: arr[i].id
        , guidewords: arr[i].guidewords
        , deviations: arr[i].deviations
        , process: arr[i].process
        , area: arr[i].area
        , selected: false
        , seq: $scope.selectDataNodeList
      };

      $scope.selectDataGuideWords.push(newInput);

    }

    $apply();

  };
  $scope.removeDataGuideWords = function (id, seq_session) {
    $scope.selectDataDataGuideWords = $filter('filter')($scope.selectDataGuideWords, function (item) {
      return !(item.id == id && item.seq == seq_session);
    });
  };

  $scope.selectDataNodeDrawing = [{ seq_node: 1, seq_drawing: 0, seq: 0 },];
  $scope.MaxSeqDataNodeDrawing = 0;
  $scope.addDataNodeDrawing = function (seq, seq_node) {

    $scope.MaxSeqDataNodeDrawing = ($scope.MaxSeqDataNodeDrawing) + 1;
    var xValues = $scope.MaxSeqDataNodeDrawing;

    var newInput = { seq_node: seq_node, seq_drawing: 0, seq: xValues };
    $scope.selectDataNodeDrawing.push(newInput);

  };

  $scope.updateDataNodeDrawing = function (seq, seq_node, seq_drawing) {

    for (let i = 0; i < $scope.selectDataNodeDrawing.length; i++) {
      if ($scope.selectDataNodeDrawing[i].seq_node === seq_node && $scope.selectDataNodeDrawing[i].seq === seq) {
        $scope.selectDataNodeDrawing[i].seq_drawing = seq_drawing;
      }
    };

  };

  $scope.removeDataNodeDrawing = function (seq, seq_node) {

    $scope.selectDataNodeDrawing = $filter('filter')($scope.selectDataNodeDrawing, function (item) {
      return !(item.seq == seq && item.seq_node == seq_node);
    });

    if (($filter('filter')($scope.selectDataNodeDrawing, function (item) {
      return (item.seq_node == seq_node);
    })).length === 0) {
      $scope.addDataNodeDrawing(seq, seq_node);
    }

  };



  // <===== (Kul) WorkSheet zone function  ======>  
  $scope.DataCategory = [{ id: "P", name: "P", description: "People" },
  { id: "A", name: "A", description: "Assets" },
  { id: "E", name: "E", description: "Environment" },
  { id: "R", name: "R", description: "Reputation" },
  { id: "Q", name: "Q", description: "Product Quality" },];

  //$scope.DataNodeListView = [{ no: 1, seq: 1, node_text: '', design_intent: '', design_conditions: '', operating_conditions: '', node_boundary: '', node_drawing: '' },];
  $scope.viewDataNodeList = function (seq) {

    try {
      $scope.DataNodeListView = [];
      $scope.DataNodeListView = $filter('filter')($scope.DataNodeList, { seq: seq });

      console.log($scope.DataNodeListView);

    } catch (e) { alert(e); }
  };

  $scope.DataWorkSheet = [{
    no: 1, row_type: 'causes', seq_node: 1, seq_guidewords: 1, seq: 1, seq_causes: 1, seq_consequences: 1, seq_consequences_sub: 1
    , guidewords: 'No Flow', deviations: 'None', consequences: '', causes: '', consequences: ''
    , ram_category: 'P'
    , ram_befor_security: '', ram_befor_likelihood: '', ram_befor_risk: ''
    , major_accident_event: '', existing_safeguards: ''
    , ram_after_security: '', ram_after_likelihood: '', ram_after_risk: ''
    , recommendations: '', responder_id: '', responder_name: '', responder_display: '', responder_email: '', responder_profile: '', action_status: ''
  },];

  $scope.MaxSeqDataWorkSheet = 1;//seq
  $scope.selectDataWorkSheet = 1;
  $scope.MaxSeqDataWorkSheetCauses = 1;//seq_causes
  $scope.selectDataWorkSheetCauses = 1;
  $scope.MaxSeqDataWorkSheetConsequences = 1;//seq_consequences
  $scope.selectDataWorkSheetConsequences = 1;
  $scope.MaxSeqDataWorkSheetConsequences_Sub = 1;//seq_consequences_sub
  $scope.selectDataWorkSheetConsequences_sub = 1;

  $scope.addDataWorkSheet = function (row_type, seq_node, seq_guidewords, seq, seq_causes, seq_consequences, seq_consequences_sub) {

    $scope.MaxSeqDataWorkSheet = ($scope.MaxSeqDataWorkSheet) + 1;
    var xseq = $scope.MaxSeqDataWorkSheet;
    if (row_type === "causes") { $scope.MaxSeqDataWorkSheetCauses = ($scope.MaxSeqDataWorkSheetCauses) + 1; }
    var xseq_causes = $scope.MaxSeqDataWorkSheetCauses;
    if (row_type === "consequences") { $scope.MaxSeqDataWorkSheetConsequences = ($scope.MaxSeqDataWorkSheetConsequences) + 1; }
    var xseq_consequences = $scope.MaxSeqDataWorkSheetConsequences;
    if (row_type === "consequences_sub") { $scope.MaxSeqDataWorkSheetConsequences_Sub = ($scope.MaxSeqDataWorkSheetConsequences_Sub) + 1; }
    var xseq_consequences_sub = $scope.MaxSeqDataWorkSheetConsequences_Sub;

    if (row_type === "causes") {
      var newInput = { row_type: row_type, seq_node: seq_node, seq_guidewords: seq_guidewords, seq: xseq, seq_causes: xseq_causes, seq_consequences: xseq_consequences, seq_consequences_sub: xseq_consequences_sub };
    }
    else if (row_type === "consequences") {
      var newInput = { row_type: row_type, seq_node: seq_node, seq_guidewords: seq_guidewords, seq: seq, seq_causes: seq_causes, seq_consequences: xseq_consequences, seq_consequences_sub: xseq_consequences_sub };
    }
    else if (row_type === "consequences_sub") {
      var newInput = { row_type: row_type, seq_node: seq_node, seq_guidewords: seq_guidewords, seq: seq, seq_causes: seq_causes, seq_consequences: seq_consequences, seq_consequences_sub: xseq_consequences_sub };
    }
    //var newInput = { seq_node: seq_node, seq: xseq, seq_causes: xseq_causes, seq_consequences: xseq_consequences, seq_consequences_sub: xseq_consequences_sub };

    $scope.DataWorkSheet.push(newInput);

    $scope.selectDataWorkSheet = xseq;

    running_no_WorkSheet();
  }
  $scope.copyDataWorkSheet = function (seq) {

    $scope.MaxSeqDataWorkSheet = ($scope.MaxSeqDataWorkSheet) + 1;
    var xValues = $scope.MaxSeqDataWorkSheet;
    var newInput = { seq: xValues };

    var arr = $filter('filter')($scope.DataWorkSheet, function (item) {
      return (item.seq == seq);
    });

    for (let i = 0; i < arr.length; i++) {
      var newInput = {
        seq: xValues
        , node_text: arr[i].node_text
        , design_intent: arr[i].design_intent
        , design_conditions: arr[i].design_conditions
        , operating_conditions: arr[i].operating_conditions
        , node_boundary: arr[i].node_boundary
        , node_drawing: arr[i].node_drawing
      };
    };
    $scope.DataWorkSheet.push(newInput);

    running_no_WorkSheet();

    $scope.selectDataWorkSheet = xValues;

    var arr = $filter('filter')($scope.selectDataNodeDrawing, { seq_node: seq });
    for (let i = 0; i < arr.length; i++) {
      $scope.MaxSeqDataNodeDrawing = ($scope.MaxSeqDataNodeDrawing) + 1;
      var xMaxSeqDataNodeDrawing = $scope.MaxSeqDataNodeDrawing;
      var newInput = {
        seq_node: xValues
        , seq_drawing: arr[i].seq_drawing
        , seq: xMaxSeqDataNodeDrawing
      };
      $scope.selectDataNodeDrawing.push(newInput);
    }

  }
  $scope.removeDataWorkSheet = function (seq) {

    $scope.DataWorkSheet = $filter('filter')($scope.DataWorkSheet, function (item) {
      return !(item.seq == seq);
    });

    if ($scope.DataWorkSheet.length === 0) {
      $scope.addDataWorkSheet();
    }
    running_no_WorkSheet();
  };
  function running_no_WorkSheet() {
    for (let i = 0; i < $scope.DataWorkSheet.length; i++) {
      $scope.DataWorkSheet[i].no = (i + 1);
    };

  }

  $scope.openModalEmployeeCheck = function (seq) {
    $scope.selectDataWorkSheet = seq;
    //alert($scope.selectDataWorkSheet);
    var arr = $scope.GuideWordslist;
    for (let i = 0; i < arr.length; i++) {

      try {
        var ar_check = $filter('filter')($scope.selectDataGuideWords, { seq: seq, id: arr[i].id });

        if (ar_check.length > 0) {
          $scope.GuideWordslist[i].selected = true;
        } else {
          $scope.GuideWordslist[i].selected = false;

        }
      } catch (e) { return; }
    };
  };

  $scope.openModalDataRAM = function (ram_type, seq, ram_befor) {
    //alert( ram_type);
    $scope.selectDataWorkSheet = seq;
    $scope.selectDataWorkSheetRAM_Type = ram_type;
    $scope.selectDataWorkSheetRAM_Befor = ram_befor;
    // alert($scope.selectDataWorkSheetRAM_Type);
  }
  $scope.selectDataRAM = function (ram_type, id_select) {

    var xseq = $scope.selectDataWorkSheet;
    var xbefor = $scope.selectDataWorkSheetRAM_Befor;

    //alert(xbefor);

    for (let i = 0; i < $scope.DataWorkSheet.length; i++) {
      try {
        if (xbefor === "befor") {
          if (ram_type === "s") { $scope.DataWorkSheet[i].ram_befor_security = id_select; }
          if (ram_type === "l") { $scope.DataWorkSheet[i].ram_befor_likelihood = id_select; }

          //red,yellow,green,white
          if ($scope.DataWorkSheet[i].ram_befor_security !== "" && $scope.DataWorkSheet[i].ram_befor_likelihood !== "") {
            if ($scope.DataWorkSheet[i].ram_befor_security == "5") {
              if ($scope.DataWorkSheet[i].ram_befor_likelihood == "A" || $scope.DataWorkSheet[i].ram_befor_likelihood == "B") {
                $scope.DataWorkSheet[i].ram_befor_risk = "M";
              } else {
                $scope.DataWorkSheet[i].ram_befor_risk = "H";
              }
            }
            if ($scope.DataWorkSheet[i].ram_befor_security == "4") {
              if ($scope.DataWorkSheet[i].ram_befor_likelihood == "A") {
                $scope.DataWorkSheet[i].ram_befor_risk = "L";
              } else if ($scope.DataWorkSheet[i].ram_befor_likelihood == "B" || $scope.DataWorkSheet[i].ram_befor_likelihood == "C") {
                $scope.DataWorkSheet[i].ram_befor_risk = "M";
              } else {
                $scope.DataWorkSheet[i].ram_befor_risk = "H";
              }
            }
            if ($scope.DataWorkSheet[i].ram_befor_security == "3") {
              if ($scope.DataWorkSheet[i].ram_befor_likelihood == "A" || $scope.DataWorkSheet[i].ram_befor_likelihood == "B") {
                $scope.DataWorkSheet[i].ram_befor_risk = "L";
              } else if ($scope.DataWorkSheet[i].ram_befor_likelihood == "C" || $scope.DataWorkSheet[i].ram_befor_likelihood == "D") {
                $scope.DataWorkSheet[i].ram_befor_risk = "M";
              } else {
                $scope.DataWorkSheet[i].ram_befor_risk = "H";
              }
            }
            if ($scope.DataWorkSheet[i].ram_befor_security == "2") {
              if ($scope.DataWorkSheet[i].ram_befor_likelihood == "A" || $scope.DataWorkSheet[i].ram_befor_likelihood == "B"
                || $scope.DataWorkSheet[i].ram_befor_likelihood == "C") {
                $scope.DataWorkSheet[i].ram_befor_risk = "L";
              } else {
                $scope.DataWorkSheet[i].ram_befor_risk = "M";
              }
            }
            if ($scope.DataWorkSheet[i].ram_befor_security == "1") {
              if ($scope.DataWorkSheet[i].ram_befor_likelihood == "A" || $scope.DataWorkSheet[i].ram_befor_likelihood == "B") {
                $scope.DataWorkSheet[i].ram_befor_risk = "L";
              } else {
                $scope.DataWorkSheet[i].ram_befor_risk = "";
              }
            }

          }

        }
        else {
          if (ram_type === "s") { $scope.DataWorkSheet[i].ram_after_security = id_select; }
          if (ram_type === "l") { $scope.DataWorkSheet[i].ram_after_likelihood = id_select; }

          //red,yellow,green,white
          if ($scope.DataWorkSheet[i].ram_after_security !== "" && $scope.DataWorkSheet[i].ram_after_likelihood !== "") {
            if ($scope.DataWorkSheet[i].ram_after_security == "5") {
              if ($scope.DataWorkSheet[i].ram_after_likelihood == "A" || $scope.DataWorkSheet[i].ram_after_likelihood == "B") {
                $scope.DataWorkSheet[i].ram_after_risk = "M";
              } else {
                $scope.DataWorkSheet[i].ram_after_risk = "H";
              }
            }
            if ($scope.DataWorkSheet[i].ram_after_security == "4") {
              if ($scope.DataWorkSheet[i].ram_after_likelihood == "A") {
                $scope.DataWorkSheet[i].ram_after_risk = "L";
              } else if ($scope.DataWorkSheet[i].ram_after_likelihood == "B" || $scope.DataWorkSheet[i].ram_after_likelihood == "C") {
                $scope.DataWorkSheet[i].ram_after_risk = "M";
              } else {
                $scope.DataWorkSheet[i].ram_after_risk = "H";
              }
            }
            if ($scope.DataWorkSheet[i].ram_after_security == "3") {
              if ($scope.DataWorkSheet[i].ram_after_likelihood == "A" || $scope.DataWorkSheet[i].ram_after_likelihood == "B") {
                $scope.DataWorkSheet[i].ram_after_risk = "L";
              } else if ($scope.DataWorkSheet[i].ram_after_likelihood == "C" || $scope.DataWorkSheet[i].ram_after_likelihood == "D") {
                $scope.DataWorkSheet[i].ram_after_risk = "M";
              } else {
                $scope.DataWorkSheet[i].ram_after_risk = "H";
              }
            }
            if ($scope.DataWorkSheet[i].ram_after_security == "2") {
              if ($scope.DataWorkSheet[i].ram_after_likelihood == "A" || $scope.DataWorkSheet[i].ram_after_likelihood == "B"
                || $scope.DataWorkSheet[i].ram_after_likelihood == "C") {
                $scope.DataWorkSheet[i].ram_after_risk = "L";
              } else {
                $scope.DataWorkSheet[i].ram_after_risk = "M";
              }
            }
            if ($scope.DataWorkSheet[i].ram_after_security == "1") {
              if ($scope.DataWorkSheet[i].ram_after_likelihood == "A" || $scope.DataWorkSheet[i].ram_after_likelihood == "B") {
                $scope.DataWorkSheet[i].ram_after_risk = "L";
              } else {
                $scope.DataWorkSheet[i].ram_after_risk = "";
              }
            }

          }


        }


      } catch (e) { return; }
    };

  }

  $scope.openModalDataEmployee = function (seq) {
    //alert( ram_type);
    $scope.selectDataWorkSheet = seq;
  }
  $scope.selectDataEmployee = function (id, employee, email, profile) {
    var xseq = $scope.selectDataWorkSheet;

    for (let i = 0; i < $scope.DataWorkSheet.length; i++) {
      try {
        if ($scope.DataWorkSheet[i].seq === xseq) {
          $scope.DataWorkSheet[i].responder_id = id;
          $scope.DataWorkSheet[i].responder_name = employee;
          $scope.DataWorkSheet[i].responder_display = employee;
          $scope.DataWorkSheet[i].responder_email = email;
          $scope.DataWorkSheet[i].responder_profile = profile;
          break;
        }
      } catch (e) { }
    };
  };

  $scope.removeDataEmpWorkSheet = function (id, seq) {
    var xseq = seq;
    for (let i = 0; i < $scope.DataWorkSheet.length; i++) {
      try {
        if ($scope.DataWorkSheet[i].seq === xseq) {
          $scope.DataWorkSheet[i].responder_id = "";
          $scope.DataWorkSheet[i].responder_name = "";
          $scope.DataWorkSheet[i].responder_display = "";
          $scope.DataWorkSheet[i].responder_email = "";
          $scope.DataWorkSheet[i].responder_profile = "";
          break;
        }
      } catch (e) { }
    };
  };

  $scope.zoom_div_worksheet = function (a) {
     
    var el = document.getElementById('WorksheetTable');

    if (document.fullscreenElement) {
      document.exitFullscreen(); 
      el.style.zoom = 0;  
    } else {
      $('#WorksheetTable').get(0).requestFullscreen();
       
      el.style.zoom = 0.7; 
      el.style.backgroundColor = "white";
    }


  };
});