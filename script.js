(function () {
  'use strict';

  // ===== DOM Elements =====
  const introSection = document.getElementById('intro');
  const calculatorSection = document.getElementById('calculator');
  const resultsSection = document.getElementById('results');
  const startBtn = document.getElementById('startBtn');
  const calculateBtn = document.getElementById('calculateBtn');
  const retakeBtn = document.getElementById('retakeBtn');
  const progressFill = document.getElementById('progressFill');
  const form = document.getElementById('bioAgeForm');

  const totalSteps = 4;
  let currentStep = 1;

  // ===== Navigation =====
  startBtn.addEventListener('click', function () {
    introSection.classList.add('hidden');
    calculatorSection.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  retakeBtn.addEventListener('click', function () {
    resultsSection.classList.add('hidden');
    introSection.classList.remove('hidden');
    form.reset();
    goToStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Step navigation via next/prev buttons
  document.querySelectorAll('.next-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (validateStep(currentStep)) {
        goToStep(currentStep + 1);
      }
    });
  });

  document.querySelectorAll('.prev-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      goToStep(currentStep - 1);
    });
  });

  calculateBtn.addEventListener('click', function () {
    if (validateStep(currentStep)) {
      showResults();
    }
  });

  function goToStep(step) {
    document.querySelectorAll('.step').forEach(function (el) {
      el.classList.remove('active');
    });
    var target = document.querySelector('.step[data-step="' + step + '"]');
    if (target) {
      target.classList.add('active');
    }
    currentStep = step;
    updateProgress();
    window.scrollTo({ top: calculatorSection.offsetTop - 60, behavior: 'smooth' });
  }

  function updateProgress() {
    var pct = (currentStep / totalSteps) * 100;
    progressFill.style.width = pct + '%';

    document.querySelectorAll('.progress-dot').forEach(function (dot) {
      var s = parseInt(dot.getAttribute('data-step'), 10);
      dot.classList.remove('active', 'completed');
      if (s === currentStep) {
        dot.classList.add('active');
      } else if (s < currentStep) {
        dot.classList.add('completed');
      }
    });
  }

  // ===== Validation =====
  function validateStep(step) {
    var valid = true;
    if (step === 1) {
      valid = requireField('age') && requireField('sex') && valid;
    }
    return valid;
  }

  function requireField(id) {
    var el = document.getElementById(id);
    if (!el.value) {
      el.classList.add('error');
      el.addEventListener('input', function handler() {
        el.classList.remove('error');
        el.removeEventListener('input', handler);
      });
      el.addEventListener('change', function handler() {
        el.classList.remove('error');
        el.removeEventListener('change', handler);
      });
      return false;
    }
    el.classList.remove('error');
    return true;
  }

  // ===== Calculation Engine =====
  function getVal(id) {
    var el = document.getElementById(id);
    var v = parseFloat(el.value);
    return isNaN(v) ? null : v;
  }

  function collectInputs() {
    return {
      age: getVal('age'),
      sex: document.getElementById('sex').value,
      height: getVal('height'),
      weight: getVal('weight'),
      systolic: getVal('systolic'),
      diastolic: getVal('diastolic'),
      restingHR: getVal('restingHR'),
      glucose: getVal('glucose'),
      totalChol: getVal('totalChol'),
      hdl: getVal('hdl'),
      crp: getVal('crp'),
      exercise: getVal('exercise'),
      sleep: getVal('sleep'),
      smoking: getVal('smoking'),
      alcohol: getVal('alcohol'),
      diet: getVal('diet'),
      stress: getVal('stress'),
      fasting: getVal('fasting')
    };
  }

  /**
   * Calculate biological age offset from chronological age.
   * Uses a simplified scoring model based on published biomarker research.
   * Each factor contributes a positive (aging) or negative (rejuvenating) offset.
   */
  function calculateBioAge(data) {
    var offset = 0;
    var breakdown = [];

    // --- BMI ---
    if (data.height && data.weight) {
      var heightM = data.height / 100;
      var bmi = data.weight / (heightM * heightM);
      var bmiOffset = 0;
      if (bmi < 18.5) {
        bmiOffset = 1;
      } else if (bmi >= 18.5 && bmi < 25) {
        bmiOffset = -1;
      } else if (bmi >= 25 && bmi < 30) {
        bmiOffset = 1.5;
      } else {
        bmiOffset = 3;
      }
      offset += bmiOffset;
      breakdown.push({ label: 'BMI (' + bmi.toFixed(1) + ')', impact: bmiOffset, rating: bmiOffset <= 0 ? 'good' : bmiOffset <= 1.5 ? 'moderate' : 'poor' });
    }

    // --- Blood Pressure ---
    if (data.systolic !== null) {
      var bpOffset = 0;
      if (data.systolic < 120) {
        bpOffset = -1;
      } else if (data.systolic < 130) {
        bpOffset = 0;
      } else if (data.systolic < 140) {
        bpOffset = 1.5;
      } else {
        bpOffset = 3;
      }
      offset += bpOffset;
      breakdown.push({ label: 'Blood Pressure (' + data.systolic + '/' + (data.diastolic || '?') + ')', impact: bpOffset, rating: bpOffset <= 0 ? 'good' : bpOffset <= 1.5 ? 'moderate' : 'poor' });
    }

    // --- Resting Heart Rate ---
    if (data.restingHR !== null) {
      var hrOffset = 0;
      if (data.restingHR < 60) {
        hrOffset = -1.5;
      } else if (data.restingHR <= 72) {
        hrOffset = -0.5;
      } else if (data.restingHR <= 84) {
        hrOffset = 1;
      } else {
        hrOffset = 2.5;
      }
      offset += hrOffset;
      breakdown.push({ label: 'Resting Heart Rate (' + data.restingHR + ' bpm)', impact: hrOffset, rating: hrOffset <= 0 ? 'good' : hrOffset <= 1 ? 'moderate' : 'poor' });
    }

    // --- Fasting Glucose ---
    if (data.glucose !== null) {
      var glucOffset = 0;
      if (data.glucose < 85) {
        glucOffset = -1;
      } else if (data.glucose <= 99) {
        glucOffset = 0;
      } else if (data.glucose <= 125) {
        glucOffset = 2;
      } else {
        glucOffset = 4;
      }
      offset += glucOffset;
      breakdown.push({ label: 'Fasting Glucose (' + data.glucose + ' mg/dL)', impact: glucOffset, rating: glucOffset <= 0 ? 'good' : glucOffset <= 2 ? 'moderate' : 'poor' });
    }

    // --- Cholesterol Ratio ---
    if (data.totalChol !== null && data.hdl !== null && data.hdl > 0) {
      var ratio = data.totalChol / data.hdl;
      var cholOffset = 0;
      if (ratio < 3.5) {
        cholOffset = -1.5;
      } else if (ratio <= 5) {
        cholOffset = 0;
      } else {
        cholOffset = 2;
      }
      offset += cholOffset;
      breakdown.push({ label: 'Cholesterol Ratio (' + ratio.toFixed(1) + ')', impact: cholOffset, rating: cholOffset <= 0 ? 'good' : cholOffset <= 0 ? 'moderate' : 'poor' });
    }

    // --- CRP (inflammation) ---
    if (data.crp !== null) {
      var crpOffset = 0;
      if (data.crp < 1) {
        crpOffset = -1;
      } else if (data.crp <= 3) {
        crpOffset = 0.5;
      } else {
        crpOffset = 2.5;
      }
      offset += crpOffset;
      breakdown.push({ label: 'Inflammation (CRP ' + data.crp + ' mg/L)', impact: crpOffset, rating: crpOffset <= 0 ? 'good' : crpOffset <= 1 ? 'moderate' : 'poor' });
    }

    // --- Exercise ---
    if (data.exercise !== null) {
      var exOffsets = [3, 1, -1, -2, -2.5];
      var exOffset = exOffsets[data.exercise] || 0;
      offset += exOffset;
      var exLabels = ['Sedentary', 'Light', 'Moderate', 'Active', 'Very Active'];
      breakdown.push({ label: 'Exercise (' + exLabels[data.exercise] + ')', impact: exOffset, rating: exOffset <= 0 ? 'good' : exOffset <= 1 ? 'moderate' : 'poor' });
    }

    // --- Sleep ---
    if (data.sleep !== null) {
      var sleepOffset = 0;
      if (data.sleep >= 7 && data.sleep <= 9) {
        sleepOffset = -1;
      } else if (data.sleep >= 6 && data.sleep < 7) {
        sleepOffset = 0.5;
      } else if (data.sleep > 9 && data.sleep <= 10) {
        sleepOffset = 0.5;
      } else {
        sleepOffset = 2;
      }
      offset += sleepOffset;
      breakdown.push({ label: 'Sleep (' + data.sleep + ' hrs)', impact: sleepOffset, rating: sleepOffset <= 0 ? 'good' : sleepOffset <= 0.5 ? 'moderate' : 'poor' });
    }

    // --- Smoking ---
    if (data.smoking !== null) {
      var smokOffsets = [-0.5, 1, 3, 5];
      var smokOffset = smokOffsets[data.smoking] || 0;
      offset += smokOffset;
      var smokLabels = ['Never', 'Former', 'Occasional', 'Daily'];
      breakdown.push({ label: 'Smoking (' + smokLabels[data.smoking] + ')', impact: smokOffset, rating: smokOffset <= 0 ? 'good' : smokOffset <= 1 ? 'moderate' : 'poor' });
    }

    // --- Alcohol ---
    if (data.alcohol !== null) {
      var alcOffsets = [0, 0, 2];
      var alcOffset = alcOffsets[data.alcohol] || 0;
      offset += alcOffset;
      var alcLabels = ['None', 'Moderate', 'Heavy'];
      breakdown.push({ label: 'Alcohol (' + alcLabels[data.alcohol] + ')', impact: alcOffset, rating: alcOffset <= 0 ? 'good' : alcOffset <= 0 ? 'moderate' : 'poor' });
    }

    // --- Diet ---
    if (data.diet !== null) {
      var dietOffsets = [3, 0.5, -1, -2];
      var dietOffset = dietOffsets[data.diet] || 0;
      offset += dietOffset;
      var dietLabels = ['Poor', 'Average', 'Good', 'Excellent'];
      breakdown.push({ label: 'Diet (' + dietLabels[data.diet] + ')', impact: dietOffset, rating: dietOffset <= 0 ? 'good' : dietOffset <= 0.5 ? 'moderate' : 'poor' });
    }

    // --- Stress ---
    if (data.stress !== null) {
      var stressOffsets = [-1, 0.5, 1.5, 3];
      var stressOffset = stressOffsets[data.stress] || 0;
      offset += stressOffset;
      var stressLabels = ['Low', 'Moderate', 'High', 'Very High'];
      breakdown.push({ label: 'Stress (' + stressLabels[data.stress] + ')', impact: stressOffset, rating: stressOffset <= 0 ? 'good' : stressOffset <= 1 ? 'moderate' : 'poor' });
    }

    // --- Fasting Practice ---
    if (data.fasting !== null) {
      var fastOffsets = [0, -0.5, -1.5, -2.5];
      var fastOffset = fastOffsets[data.fasting] || 0;
      offset += fastOffset;
      var fastLabels = ['Never', 'Occasional', 'Regular IF', 'FMD / ProLon'];
      breakdown.push({ label: 'Fasting (' + fastLabels[data.fasting] + ')', impact: fastOffset, rating: fastOffset <= 0 ? 'good' : 'moderate' });
    }

    // Clamp total offset to a reasonable range
    offset = Math.max(-15, Math.min(15, offset));

    var bioAge = Math.round(data.age + offset);
    bioAge = Math.max(18, bioAge);

    return { bioAge: bioAge, chronoAge: data.age, offset: offset, breakdown: breakdown };
  }

  // ===== Results Display =====
  function showResults() {
    var data = collectInputs();
    var result = calculateBioAge(data);

    calculatorSection.classList.add('hidden');
    resultsSection.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Age values
    document.getElementById('chronoAge').textContent = result.chronoAge;
    document.getElementById('bioAge').textContent = result.bioAge;

    // Age difference message
    var diff = result.bioAge - result.chronoAge;
    var diffEl = document.getElementById('ageDiff');
    if (diff < -2) {
      diffEl.textContent = 'Your body is ' + Math.abs(diff) + ' years younger than your age!';
      diffEl.className = 'age-diff younger';
    } else if (diff > 2) {
      diffEl.textContent = 'Your body is ' + diff + ' years older than your age.';
      diffEl.className = 'age-diff older';
    } else {
      diffEl.textContent = 'Your biological age is about the same as your chronological age.';
      diffEl.className = 'age-diff same';
    }

    // Gauge
    drawGauge(result.chronoAge, result.bioAge);

    // Breakdown
    renderBreakdown(result.breakdown);

    // Recommendations
    renderRecommendations(data, result.breakdown);
  }

  // ===== Gauge Drawing =====
  function drawGauge(chronoAge, bioAge) {
    var canvas = document.getElementById('gaugeCanvas');
    var ctx = canvas.getContext('2d');
    var w = canvas.width;
    var h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    var cx = w / 2;
    var cy = h - 10;
    var radius = 120;
    var startAngle = Math.PI;
    var endAngle = 2 * Math.PI;

    // Background arc
    ctx.beginPath();
    ctx.arc(cx, cy, radius, startAngle, endAngle);
    ctx.lineWidth = 18;
    ctx.strokeStyle = '#E5E0DA';
    ctx.lineCap = 'round';
    ctx.stroke();

    // Colored arc — map bio age relative to chrono age
    var diff = bioAge - chronoAge;
    var normalizedDiff = Math.max(-15, Math.min(15, diff));
    // Map -15..+15 to 0..1 where 0.5 is "same age"
    var ratio = (normalizedDiff + 15) / 30;
    var sweepAngle = startAngle + ratio * Math.PI;

    // Color gradient: green (younger) -> yellow (same) -> red (older)
    var color;
    if (ratio < 0.4) {
      color = '#4A8B5C';
    } else if (ratio < 0.55) {
      color = '#D4A843';
    } else {
      color = '#C45B4A';
    }

    ctx.beginPath();
    ctx.arc(cx, cy, radius, startAngle, sweepAngle);
    ctx.lineWidth = 18;
    ctx.strokeStyle = color;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Needle
    var needleAngle = sweepAngle;
    var needleLen = radius - 30;
    var nx = cx + needleLen * Math.cos(needleAngle);
    var ny = cy + needleLen * Math.sin(needleAngle);

    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(nx, ny);
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = '#2C2C2C';
    ctx.stroke();

    // Center dot
    ctx.beginPath();
    ctx.arc(cx, cy, 5, 0, 2 * Math.PI);
    ctx.fillStyle = '#2C2C2C';
    ctx.fill();

    // Labels
    ctx.font = '12px TWKLausanne, sans-serif';
    ctx.fillStyle = '#6B6B6B';
    ctx.textAlign = 'left';
    ctx.fillText('Younger', 15, cy - 5);
    ctx.textAlign = 'right';
    ctx.fillText('Older', w - 15, cy - 5);
  }

  // ===== Breakdown Rendering =====
  function renderBreakdown(breakdown) {
    var container = document.getElementById('breakdownList');
    container.innerHTML = '';

    breakdown.forEach(function (item) {
      var div = document.createElement('div');
      div.className = 'breakdown-item';

      var impactText = '';
      if (item.impact > 0) {
        impactText = '+' + item.impact.toFixed(1) + ' yrs';
      } else if (item.impact < 0) {
        impactText = item.impact.toFixed(1) + ' yrs';
      } else {
        impactText = 'Neutral';
      }

      div.innerHTML =
        '<span class="breakdown-label">' + item.label + '</span>' +
        '<span class="breakdown-score score-' + item.rating + '">' + impactText + '</span>';

      container.appendChild(div);
    });
  }

  // ===== Recommendations =====
  function renderRecommendations(data, breakdown) {
    var container = document.getElementById('recommendations');
    container.innerHTML = '';
    var recs = [];

    // Find areas to improve (sorted by worst impact first)
    var sorted = breakdown.slice().sort(function (a, b) { return b.impact - a.impact; });

    sorted.forEach(function (item) {
      if (item.impact > 0 && recs.length < 4) {
        var rec = getRecommendation(item.label, item.impact);
        if (rec) recs.push(rec);
      }
    });

    // Always suggest fasting if not already doing it
    if (data.fasting === null || data.fasting < 2) {
      recs.push({
        title: 'Consider a Fasting-Mimicking Diet',
        text: 'Clinical studies show that ProLon\'s 5-day Fasting Mimicking Diet can reduce biological age markers, lower inflammation, and promote cellular rejuvenation.'
      });
    }

    if (recs.length === 0) {
      recs.push({
        title: 'Keep It Up!',
        text: 'Your lifestyle choices are supporting healthy aging. Continue your current habits and consider periodic fasting for even greater benefits.'
      });
    }

    recs.forEach(function (rec) {
      var div = document.createElement('div');
      div.className = 'recommendation-item';
      div.innerHTML = '<h4>' + rec.title + '</h4><p>' + rec.text + '</p>';
      container.appendChild(div);
    });
  }

  function getRecommendation(label, impact) {
    if (label.indexOf('BMI') === 0) {
      return {
        title: 'Optimize Your Body Composition',
        text: 'A healthy BMI (18.5-24.9) is associated with reduced biological aging. Focus on whole foods, portion control, and regular physical activity.'
      };
    }
    if (label.indexOf('Blood Pressure') === 0) {
      return {
        title: 'Manage Blood Pressure',
        text: 'High blood pressure accelerates biological aging. Reduce sodium, increase potassium-rich foods, exercise regularly, and manage stress.'
      };
    }
    if (label.indexOf('Resting Heart Rate') === 0) {
      return {
        title: 'Improve Cardiovascular Fitness',
        text: 'A lower resting heart rate indicates better heart health. Regular aerobic exercise (walking, swimming, cycling) can help bring it down over time.'
      };
    }
    if (label.indexOf('Fasting Glucose') === 0) {
      return {
        title: 'Improve Blood Sugar Control',
        text: 'Elevated fasting glucose accelerates aging. Reduce refined carbs, increase fiber intake, exercise regularly, and consider periodic fasting.'
      };
    }
    if (label.indexOf('Inflammation') === 0) {
      return {
        title: 'Reduce Chronic Inflammation',
        text: 'Elevated CRP indicates inflammation, a key driver of biological aging. Anti-inflammatory foods (omega-3s, leafy greens), exercise, and fasting can help.'
      };
    }
    if (label.indexOf('Exercise') === 0) {
      return {
        title: 'Move More',
        text: 'Regular exercise is one of the most powerful anti-aging tools. Aim for at least 150 minutes of moderate activity or 75 minutes of vigorous activity per week.'
      };
    }
    if (label.indexOf('Sleep') === 0) {
      return {
        title: 'Optimize Your Sleep',
        text: 'Quality sleep (7-9 hours) is essential for cellular repair and healthy aging. Maintain a consistent schedule and limit screens before bed.'
      };
    }
    if (label.indexOf('Smoking') === 0) {
      return {
        title: 'Quit Smoking',
        text: 'Smoking dramatically accelerates biological aging. Talk to your doctor about cessation strategies — your body begins to heal within hours of quitting.'
      };
    }
    if (label.indexOf('Alcohol') === 0) {
      return {
        title: 'Reduce Alcohol Intake',
        text: 'Heavy alcohol consumption increases inflammation and biological aging. Try limiting to moderate amounts or taking regular breaks.'
      };
    }
    if (label.indexOf('Diet') === 0) {
      return {
        title: 'Improve Your Diet',
        text: 'A Mediterranean-style diet rich in vegetables, fruits, whole grains, and healthy fats is associated with slower biological aging.'
      };
    }
    if (label.indexOf('Stress') === 0) {
      return {
        title: 'Manage Stress',
        text: 'Chronic stress accelerates cellular aging. Practices like meditation, deep breathing, regular exercise, and adequate sleep can help lower stress levels.'
      };
    }
    return null;
  }

})();
