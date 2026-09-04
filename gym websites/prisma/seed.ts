import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Wiping existing database tables...");
  await prisma.workoutExercise.deleteMany({});
  await prisma.workoutLog.deleteMany({});
  await prisma.progressEntry.deleteMany({});
  await prisma.fitnessGoal.deleteMany({});
  await prisma.payment.deleteMany({});
  await prisma.membership.deleteMany({});
  await prisma.account.deleteMany({});
  await prisma.session.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.exercise.deleteMany({});
  await prisma.workoutPlan.deleteMany({});
  await prisma.plan.deleteMany({});
  await prisma.gymLocation.deleteMany({});

  console.log("Seeding core pricing plans...");
  const silver = await prisma.plan.create({
    data: {
      name: "Silver Club",
      slug: "silver-club",
      price: 999.0,
      duration: 1,
      tier: "SILVER",
      description: "Ideal for beginners looking to train at their home gym location.",
      features: JSON.stringify([
        "Access to home gym location",
        "Standard cardio & weight equipment",
        "Basic digital workout plans",
        "Locker room & shower access",
        "Mobile app workout tracker"
      ]),
      popular: false,
      active: true
    }
  });

  const gold = await prisma.plan.create({
    data: {
      name: "Gold Elite",
      slug: "gold-elite",
      price: 1999.0,
      duration: 1,
      tier: "GOLD",
      description: "Most popular choice. Grants access to all India locations & group fitness.",
      features: JSON.stringify([
        "Access to all 25+ India locations",
        "Standard + CrossFit zone equipment",
        "Premium structured workout splits",
        "Unlimited access to group fitness classes",
        "Digital gym card mobile pass",
        "Mobile app workout + goal tracker"
      ]),
      popular: true,
      active: true
    }
  });

  const platinum = await prisma.plan.create({
    data: {
      name: "Platinum VIP",
      slug: "platinum-vip",
      price: 3499.0,
      duration: 1,
      tier: "PLATINUM",
      description: "The ultimate tier. Includes dedicated personal training & custom diets.",
      features: JSON.stringify([
        "Access to all 25+ India locations",
        "All premium amenities & machines",
        "4 Personal Trainer sessions per month",
        "Custom diet & nutrition plans",
        "Unlimited steam bath & sauna access",
        "Priority slot booking for group classes",
        "Exclusive VIP lounge access",
        "Comprehensive fitness tracker dashboard"
      ]),
      popular: false,
      active: true
    }
  });

  console.log("Seeding exercises library...");
  const exercisesData = [
    // Chest
    {
      name: "Flat Barbell Bench Press",
      slug: "flat-barbell-bench-press",
      muscleGroup: "Chest",
      equipment: "Barbell",
      difficulty: "INTERMEDIATE",
      instructions: "1. Lie flat on a bench. Grip the barbell with hands slightly wider than shoulder-width.\n2. Unrack the bar and hold it straight over your chest.\n3. Lower the bar slowly to your mid-chest.\n4. Push the bar back up explosively to starting position, keeping your elbows slightly bent at the top.",
      tips: JSON.stringify(["Keep feet flat on the floor", "Do not arch your lower back excessively", "Control the descent of the bar"])
    },
    {
      name: "Incline Dumbbell Press",
      slug: "incline-dumbbell-press",
      muscleGroup: "Chest",
      equipment: "Dumbbell",
      difficulty: "INTERMEDIATE",
      instructions: "1. Set an incline bench to 30-45 degrees.\n2. Sit on the bench holding a dumbbell in each hand at chest level.\n3. Press the dumbbells straight up over your chest.\n4. Lower them slowly until they are parallel to your chest, then repeat.",
      tips: JSON.stringify(["Keep dumbbells aligned with upper chest", "Maintain control at the bottom", "Squeeze your chest at the peak"])
    },
    {
      name: "Chest Flyes",
      slug: "chest-flyes",
      muscleGroup: "Chest",
      equipment: "Dumbbell",
      difficulty: "BEGINNER",
      instructions: "1. Lie flat on a bench holding dumbbells above your chest with palms facing each other.\n2. With a slight bend in your elbows, lower your arms out to the sides in a wide arc.\n3. Stop when your chest is fully stretched, then return to the starting position using the same arc path.",
      tips: JSON.stringify(["Keep elbows slightly bent throughout", "Focus on the chest stretch", "Do not click weights at the top"])
    },
    {
      name: "Push-ups",
      slug: "push-ups",
      muscleGroup: "Chest",
      equipment: "Bodyweight",
      difficulty: "BEGINNER",
      instructions: "1. Start in a plank position with hands slightly wider than shoulders.\n2. Lower your body until your chest almost touches the floor.\n3. Push your body back up to the starting position.",
      tips: JSON.stringify(["Keep your body in a straight line", "Do not sag your hips", "Keep core engaged"])
    },
    // Back
    {
      name: "Pull-ups",
      slug: "pull-ups",
      muscleGroup: "Back",
      equipment: "Bodyweight",
      difficulty: "ADVANCED",
      instructions: "1. Hang from a pull-up bar with an overhand grip wider than shoulders.\n2. Pull your body up until your chin is over the bar.\n3. Lower yourself with control to the starting position.",
      tips: JSON.stringify(["Engage your shoulder blades first", "Avoid using momentum", "Extend arms fully at the bottom"])
    },
    {
      name: "Barbell Bent-Over Row",
      slug: "barbell-bent-over-row",
      muscleGroup: "Back",
      equipment: "Barbell",
      difficulty: "INTERMEDIATE",
      instructions: "1. Stand with feet shoulder-width apart, holding a barbell with an overhand grip.\n2. Hinge at your hips, keeping your back straight and knees slightly bent.\n3. Pull the bar to your lower ribs, squeezing your back muscles.\n4. Lower the bar slowly to the starting position.",
      tips: JSON.stringify(["Keep spine neutral", "Do not round your lower back", "Pull with your elbows, not hands"])
    },
    {
      name: "Lat Pulldown",
      slug: "lat-pulldown",
      muscleGroup: "Back",
      equipment: "Cable Machine",
      difficulty: "BEGINNER",
      instructions: "1. Sit at a pulldown station and adjust the knee pad.\n2. Grab the bar with an overhand grip wider than shoulders.\n3. Pull the bar down to your upper chest while leaning slightly back.\n4. Release the bar back up slowly under control.",
      tips: JSON.stringify(["Pull the bar with your elbows", "Keep chest proud", "Do not pull the bar behind your neck"])
    },
    {
      name: "Dumbbell Single-Arm Row",
      slug: "dumbbell-single-arm-row",
      muscleGroup: "Back",
      equipment: "Dumbbell",
      difficulty: "BEGINNER",
      instructions: "1. Place one knee and one hand on a flat bench.\n2. Hold a dumbbell in the opposite hand, letting it hang straight down.\n3. Pull the dumbbell to your hip, keeping your elbow tucked.\n4. Lower it back down with control.",
      tips: JSON.stringify(["Keep your spine flat", "Do not twist your torso", "Focus on squeezing the lat muscle"])
    },
    // Shoulders
    {
      name: "Overhead Barbell Press",
      slug: "overhead-barbell-press",
      muscleGroup: "Shoulders",
      equipment: "Barbell",
      difficulty: "INTERMEDIATE",
      instructions: "1. Hold a barbell at shoulder level with hands slightly wider than shoulders.\n2. Brace your core and press the bar straight up overhead.\n3. Lock out arms at the top, pushing your head slightly forward.\n4. Lower the bar with control to your shoulders.",
      tips: JSON.stringify(["Keep your core and glutes tight", "Avoid bending knees", "Path of bar should be straight"])
    },
    {
      name: "Lateral Dumbbell Raise",
      slug: "lateral-dumbbell-raise",
      muscleGroup: "Shoulders",
      equipment: "Dumbbell",
      difficulty: "BEGINNER",
      instructions: "1. Stand holding dumbbells at your sides, palms facing inward.\n2. With a slight bend in your elbows, raise the weights out to your sides.\n3. Raise until your arms are parallel to the floor, then lower slowly.",
      tips: JSON.stringify(["Do not swing the weights", "Lead with your elbows", "Keep thumbs slightly down at the top"])
    },
    {
      name: "Front Dumbbell Raise",
      slug: "front-dumbbell-raise",
      muscleGroup: "Shoulders",
      equipment: "Dumbbell",
      difficulty: "BEGINNER",
      instructions: "1. Stand holding dumbbells in front of your thighs, palms facing your thighs.\n2. Lift one dumbbell straight in front of you until arm is parallel to the floor.\n3. Lower with control and repeat with the other arm.",
      tips: JSON.stringify(["Do not lean back", "Control the weights down", "Keep core engaged"])
    },
    // Arms
    {
      name: "Bicep Barbell Curl",
      slug: "bicep-barbell-curl",
      muscleGroup: "Arms",
      equipment: "Barbell",
      difficulty: "BEGINNER",
      instructions: "1. Stand tall holding a barbell with an underhand grip at hip height.\n2. Keep your elbows tucked close to your torso.\n3. Curl the weight up while contracting your biceps until the bar is at shoulder height.\n4. Lower the bar slowly to starting position.",
      tips: JSON.stringify(["Do not swing your torso", "Keep elbows fixed at your sides", "Squeeze biceps at the peak"])
    },
    {
      name: "Hammer Curls",
      slug: "hammer-curls",
      muscleGroup: "Arms",
      equipment: "Dumbbell",
      difficulty: "BEGINNER",
      instructions: "1. Stand holding dumbbells at your sides with palms facing each other.\n2. Curl the dumbbells upward, maintaining a neutral palms-in grip.\n3. Bring dumbbells to shoulder height, squeeze, then lower slowly.",
      tips: JSON.stringify(["Maintain neutral palms-in grip", "Do not swing the hips", "Focus on the forearm and bicep outer head"])
    },
    {
      name: "Tricep Overhead Extension",
      slug: "tricep-overhead-extension",
      muscleGroup: "Arms",
      equipment: "Dumbbell",
      difficulty: "BEGINNER",
      instructions: "1. Sit or stand holding a dumbbell with both hands overhead.\n2. Slowly bend your elbows to lower the weight behind your head.\n3. Extend your elbows to press the weight back up to lock out overhead.",
      tips: JSON.stringify(["Keep elbows pointing forward", "Keep your core braced", "Do not arch your lower back"])
    },
    {
      name: "Tricep Rope Pushdowns",
      slug: "tricep-rope-pushdowns",
      muscleGroup: "Arms",
      equipment: "Cable Machine",
      difficulty: "BEGINNER",
      instructions: "1. Attach a rope to a high pulley. Grip the rope with palms facing each other.\n2. Keep your elbows tucked and press the rope down, spreading the ends at the bottom.\n3. Return to the starting position under control.",
      tips: JSON.stringify(["Keep elbows pinned to your ribs", "Squeeze triceps at the bottom", "Do not lean too far forward"])
    },
    // Legs
    {
      name: "Barbell Squats",
      slug: "barbell-squats",
      muscleGroup: "Legs",
      equipment: "Barbell",
      difficulty: "INTERMEDIATE",
      instructions: "1. Rest a barbell on your upper back/shoulders. Stand with feet slightly wider than shoulder-width.\n2. Sit back and down as if sitting in a chair, keeping chest up.\n3. Go down until thighs are parallel to the floor or lower.\n4. Push back up through your heels to return to standing.",
      tips: JSON.stringify(["Keep knees aligned with toes", "Brace your core before squatting", "Maintain neutral spine"])
    },
    {
      name: "Leg Press",
      slug: "leg-press",
      muscleGroup: "Legs",
      equipment: "Leg Press Machine",
      difficulty: "BEGINNER",
      instructions: "1. Sit on the leg press machine. Place your feet hip-width apart on the sled.\n2. Release the safety locks and lower the sled slowly toward your chest.\n3. Press the sled back up, stopping just short of locking your knees.",
      tips: JSON.stringify(["Do not lock your knees", "Keep lower back flat against the seat pad", "Do not let knees collapse inward"])
    },
    {
      name: "Leg Extensions",
      slug: "leg-extensions",
      muscleGroup: "Legs",
      equipment: "Leg Extension Machine",
      difficulty: "BEGINNER",
      instructions: "1. Sit in the machine and position the pad against your lower shins.\n2. Extend your legs out straight in front of you.\n3. Lower the weight slowly back to the starting position.",
      tips: JSON.stringify(["Do not swing the weights", "Control the negative phase", "Squeeze your quads at the top"])
    },
    {
      name: "Dumbbell Romanian Deadlifts",
      slug: "dumbbell-romanian-deadlifts",
      muscleGroup: "Legs",
      equipment: "Dumbbell",
      difficulty: "INTERMEDIATE",
      instructions: "1. Stand holding dumbbells in front of your thighs. Feet hip-width apart.\n2. Push your hips back and lower the dumbbells along your legs with a flat back.\n3. Lower until you feel a stretch in your hamstrings, then squeeze glutes to stand up.",
      tips: JSON.stringify(["Do not round your lower back", "Keep dumbbells close to your shins", "Hinge at the hips, do not squat"])
    },
    // Core
    {
      name: "Abdominal Crunches",
      slug: "abdominal-crunches",
      muscleGroup: "Core",
      equipment: "Bodyweight",
      difficulty: "BEGINNER",
      instructions: "1. Lie on your back with knees bent and feet flat on the floor.\n2. Place hands lightly behind your head or crossed over your chest.\n3. Contract your abs to raise your upper shoulders off the ground.\n4. Lower down slowly.",
      tips: JSON.stringify(["Do not pull on your neck", "Exhale on the way up", "Keep tension on abs"])
    },
    {
      name: "Planks",
      slug: "planks",
      muscleGroup: "Core",
      equipment: "Bodyweight",
      difficulty: "BEGINNER",
      instructions: "1. Place forearms on the floor, elbows under shoulders. Rest weight on toes.\n2. Keep your body in a straight line from head to heels.\n3. Hold this position while breathing deeply.",
      tips: JSON.stringify(["Keep core and glutes engaged", "Do not drop your hips", "Keep a neutral neck"])
    },
    {
      name: "Hanging Leg Raises",
      slug: "hanging-leg-raises",
      muscleGroup: "Core",
      equipment: "Bodyweight",
      difficulty: "ADVANCED",
      instructions: "1. Hang from a pull-up bar with straight arms.\n2. Keep legs straight and lift them up in front of you until they are parallel to the floor.\n3. Lower them slowly under control.",
      tips: JSON.stringify(["Do not swing your body", "Control the descent", "Exhale as you lift"])
    },
    // Full Body
    {
      name: "Burpees",
      slug: "burpees",
      muscleGroup: "Full Body",
      equipment: "Bodyweight",
      difficulty: "INTERMEDIATE",
      instructions: "1. Stand with feet shoulder-width apart. Drop into a squat, placing hands on the floor.\n2. Jump feet back into a push-up position, performing one push-up.\n3. Jump feet back under your chest into a squat.\n4. Jump straight up explosively with arms raised.",
      tips: JSON.stringify(["Maintain a fast, steady rhythm", "Do not arch back in plank", "Land softly on feet"])
    }
  ];

  const dbExercises: Record<string, any> = {};
  for (const ex of exercisesData) {
    const createdEx = await prisma.exercise.create({
      data: ex
    });
    dbExercises[ex.slug] = createdEx;
  }
  console.log(`Successfully seeded ${Object.keys(dbExercises).length} exercises.`);

  console.log("Seeding Workout Plans and exercises maps...");
  const workoutsData = [
    {
      name: "Full Body Blast",
      slug: "full-body-blast",
      category: "Full Body",
      difficulty: "BEGINNER",
      duration: 45,
      calories: 400,
      description: "A fast-paced bodyweight and light weight routine to burn fat and build stamina.",
      imageUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=600&auto=format&fit=crop",
      featured: true,
      exercises: [
        { slug: "burpees", sets: 3, reps: "15 reps", restSeconds: 60, order: 1 },
        { slug: "barbell-squats", sets: 3, reps: "12 reps", restSeconds: 90, order: 2 },
        { slug: "barbell-bent-over-row", sets: 3, reps: "12 reps", restSeconds: 90, order: 3 },
        { slug: "flat-barbell-bench-press", sets: 3, reps: "12 reps", restSeconds: 90, order: 4 },
        { slug: "planks", sets: 3, reps: "60 seconds", restSeconds: 60, order: 5 }
      ]
    },
    {
      name: "Upper Body Power",
      slug: "upper-body-power",
      category: "Strength",
      difficulty: "INTERMEDIATE",
      duration: 60,
      calories: 500,
      description: "Maximize your upper body strength with compound and isolation movements.",
      imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=600&auto=format&fit=crop",
      featured: true,
      exercises: [
        { slug: "flat-barbell-bench-press", sets: 4, reps: "8 reps", restSeconds: 90, order: 1 },
        { slug: "lat-pulldown", sets: 4, reps: "10 reps", restSeconds: 90, order: 2 },
        { slug: "overhead-barbell-press", sets: 4, reps: "8 reps", restSeconds: 90, order: 3 },
        { slug: "bicep-barbell-curl", sets: 3, reps: "12 reps", restSeconds: 60, order: 4 },
        { slug: "tricep-rope-pushdowns", sets: 3, reps: "12 reps", restSeconds: 60, order: 5 }
      ]
    },
    {
      name: "Leg Day Destroyer",
      slug: "leg-day-destroyer",
      category: "Legs",
      difficulty: "ADVANCED",
      duration: 55,
      calories: 600,
      description: "A highly intense leg routine focusing on building strength, power, and size.",
      imageUrl: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=600&auto=format&fit=crop",
      featured: true,
      exercises: [
        { slug: "barbell-squats", sets: 4, reps: "8 reps", restSeconds: 120, order: 1 },
        { slug: "leg-press", sets: 4, reps: "10 reps", restSeconds: 90, order: 2 },
        { slug: "dumbbell-romanian-deadlifts", sets: 4, reps: "10 reps", restSeconds: 90, order: 3 },
        { slug: "leg-extensions", sets: 3, reps: "15 reps", restSeconds: 60, order: 4 }
      ]
    },
    {
      name: "Push Day",
      slug: "push-day",
      category: "Strength",
      difficulty: "INTERMEDIATE",
      duration: 50,
      calories: 450,
      description: "Push-focused routine targeting chest, shoulders, and triceps.",
      imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=600&auto=format&fit=crop",
      featured: false,
      exercises: [
        { slug: "flat-barbell-bench-press", sets: 4, reps: "8-10 reps", restSeconds: 90, order: 1 },
        { slug: "overhead-barbell-press", sets: 3, reps: "10 reps", restSeconds: 90, order: 2 },
        { slug: "incline-dumbbell-press", sets: 3, reps: "12 reps", restSeconds: 90, order: 3 },
        { slug: "lateral-dumbbell-raise", sets: 3, reps: "15 reps", restSeconds: 60, order: 4 },
        { slug: "tricep-rope-pushdowns", sets: 3, reps: "12 reps", restSeconds: 60, order: 5 }
      ]
    },
    {
      name: "Pull Day",
      slug: "pull-day",
      category: "Strength",
      difficulty: "INTERMEDIATE",
      duration: 50,
      calories: 450,
      description: "Pull-focused routine targeting back, biceps, and forearms.",
      imageUrl: "https://images.unsplash.com/photo-1605296867304-46d5465a25f1?q=80&w=600&auto=format&fit=crop",
      featured: false,
      exercises: [
        { slug: "pull-ups", sets: 4, reps: "8-10 reps", restSeconds: 90, order: 1 },
        { slug: "barbell-bent-over-row", sets: 4, reps: "10 reps", restSeconds: 90, order: 2 },
        { slug: "lat-pulldown", sets: 3, reps: "12 reps", restSeconds: 90, order: 3 },
        { slug: "dumbbell-single-arm-row", sets: 3, reps: "12 reps", restSeconds: 60, order: 4 },
        { slug: "bicep-barbell-curl", sets: 3, reps: "12 reps", restSeconds: 60, order: 5 }
      ]
    },
    {
      name: "HIIT Fat Burner",
      slug: "hiit-fat-burner",
      category: "Cardio",
      difficulty: "BEGINNER",
      duration: 30,
      calories: 350,
      description: "Get your heart racing with high intensity interval bodyweight circuits.",
      imageUrl: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?q=80&w=600&auto=format&fit=crop",
      featured: false,
      exercises: [
        { slug: "burpees", sets: 4, reps: "20 reps", restSeconds: 45, order: 1 },
        { slug: "planks", sets: 4, reps: "45 seconds", restSeconds: 45, order: 2 },
        { slug: "push-ups", sets: 4, reps: "15 reps", restSeconds: 45, order: 3 }
      ]
    },
    {
      name: "Core Crusher",
      slug: "core-crusher",
      category: "Core",
      difficulty: "BEGINNER",
      duration: 20,
      calories: 180,
      description: "Quick, effective abdominal routine to sculpt a solid core and strengthen back muscles.",
      imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=600&auto=format&fit=crop",
      featured: false,
      exercises: [
        { slug: "hanging-leg-raises", sets: 3, reps: "15 reps", restSeconds: 45, order: 1 },
        { slug: "abdominal-crunches", sets: 3, reps: "20 reps", restSeconds: 45, order: 2 },
        { slug: "planks", sets: 3, reps: "60 seconds", restSeconds: 45, order: 3 }
      ]
    },
    {
      name: "Hypertrophy Arms",
      slug: "hypertrophy-arms",
      category: "Hypertrophy",
      difficulty: "ADVANCED",
      duration: 40,
      calories: 300,
      description: "Concentrated arm workout engineered to trigger muscle growth in biceps and triceps.",
      imageUrl: "https://images.unsplash.com/photo-1532029837206-abbe2b7620e3?q=80&w=600&auto=format&fit=crop",
      featured: false,
      exercises: [
        { slug: "bicep-barbell-curl", sets: 4, reps: "10 reps", restSeconds: 60, order: 1 },
        { slug: "tricep-overhead-extension", sets: 4, reps: "10 reps", restSeconds: 60, order: 2 },
        { slug: "hammer-curls", sets: 3, reps: "12 reps", restSeconds: 60, order: 3 },
        { slug: "tricep-rope-pushdowns", sets: 3, reps: "12 reps", restSeconds: 60, order: 4 }
      ]
    }
  ];

  for (const w of workoutsData) {
    const workoutPlan = await prisma.workoutPlan.create({
      data: {
        name: w.name,
        slug: w.slug,
        category: w.category,
        difficulty: w.difficulty,
        duration: w.duration,
        calories: w.calories,
        description: w.description,
        imageUrl: w.imageUrl,
        featured: w.featured
      }
    });

    for (const we of w.exercises) {
      const exercise = dbExercises[we.slug];
      if (exercise) {
        await prisma.workoutExercise.create({
          data: {
            workoutPlanId: workoutPlan.id,
            exerciseId: exercise.id,
            sets: we.sets,
            reps: we.reps,
            restSeconds: we.restSeconds,
            order: we.order
          }
        });
      }
    }
  }
  console.log("Successfully seeded 8 workout plans and linked them to exercises.");

  console.log("Seeding Gym Locations across major Indian cities...");
  const locationsData = [
    // Mumbai
    { name: "AB Fitness - Bandra West", city: "Mumbai", state: "Maharashtra", lat: 19.0583, lng: 72.8302, active: true, rating: 4.8 },
    { name: "AB Fitness - Andheri East", city: "Mumbai", state: "Maharashtra", lat: 19.1158, lng: 72.8727, active: true, rating: 4.6 },
    { name: "AB Fitness - Worli Seaface", city: "Mumbai", state: "Maharashtra", lat: 18.9986, lng: 72.8151, active: true, rating: 4.9 },
    // Delhi & NCR
    { name: "AB Fitness - Connaught Place", city: "Delhi", state: "Delhi", lat: 28.6304, lng: 77.2177, active: true, rating: 4.7 },
    { name: "AB Fitness - South Ext", city: "Delhi", state: "Delhi", lat: 28.5721, lng: 77.2205, active: true, rating: 4.5 },
    { name: "AB Fitness - Sector 29", city: "Gurugram", state: "Haryana", lat: 28.4691, lng: 77.0628, active: true, rating: 4.8 },
    { name: "AB Fitness - Noida Sector 62", city: "Noida", state: "Uttar Pradesh", lat: 28.6219, lng: 77.3639, active: true, rating: 4.4 },
    // Bengaluru
    { name: "AB Fitness - Indiranagar", city: "Bengaluru", state: "Karnataka", lat: 12.9719, lng: 77.6412, active: true, rating: 4.9 },
    { name: "AB Fitness - Koramangala", city: "Bengaluru", state: "Karnataka", lat: 12.9352, lng: 77.6244, active: true, rating: 4.7 },
    { name: "AB Fitness - Whitefield", city: "Bengaluru", state: "Karnataka", lat: 12.9698, lng: 77.7500, active: true, rating: 4.6 },
    // Pune
    { name: "AB Fitness - Koregaon Park", city: "Pune", state: "Maharashtra", lat: 18.5362, lng: 73.8933, active: true, rating: 4.8 },
    { name: "AB Fitness - Kothrud", city: "Pune", state: "Maharashtra", lat: 18.5074, lng: 73.8077, active: true, rating: 4.5 },
    // Hyderabad
    { name: "AB Fitness - Jubilee Hills", city: "Hyderabad", state: "Telangana", lat: 17.4325, lng: 78.4075, active: true, rating: 4.9 },
    { name: "AB Fitness - Gachibowli", city: "Hyderabad", state: "Telangana", lat: 17.4401, lng: 78.3489, active: true, rating: 4.7 },
    // Chennai
    { name: "AB Fitness - Adyar", city: "Chennai", state: "Tamil Nadu", lat: 13.0033, lng: 80.2550, active: true, rating: 4.6 },
    { name: "AB Fitness - Nungambakkam", city: "Chennai", state: "Tamil Nadu", lat: 13.0607, lng: 80.2462, active: true, rating: 4.7 },
    // Ahmedabad
    { name: "AB Fitness - Satellite", city: "Ahmedabad", state: "Gujarat", lat: 23.0300, lng: 72.5180, active: true, rating: 4.5 },
    { name: "AB Fitness - CG Road", city: "Ahmedabad", state: "Gujarat", lat: 23.0352, lng: 72.5620, active: true, rating: 4.4 },
    // Kolkata
    { name: "AB Fitness - Salt Lake", city: "Kolkata", state: "West Bengal", lat: 22.5800, lng: 88.4200, active: true, rating: 4.6 },
    { name: "AB Fitness - Park Street", city: "Kolkata", state: "West Bengal", lat: 22.5532, lng: 88.3512, active: true, rating: 4.8 },
    // Others
    { name: "AB Fitness - Hazratganj", city: "Lucknow", state: "Uttar Pradesh", lat: 26.8500, lng: 80.9400, active: true, rating: 4.5 },
    { name: "AB Fitness - Malviya Nagar", city: "Jaipur", state: "Rajasthan", lat: 26.8524, lng: 75.8202, active: true, rating: 4.4 },
    { name: "AB Fitness - Vijay Nagar", city: "Indore", state: "Madhya Pradesh", lat: 22.7533, lng: 75.8937, active: true, rating: 4.6 },
    { name: "AB Fitness - Panaji", city: "Goa", state: "Goa", lat: 15.4909, lng: 73.8278, active: true, rating: 4.8 },
    { name: "AB Fitness - Sector 17", city: "Chandigarh", state: "Chandigarh", lat: 30.7410, lng: 76.7820, active: true, rating: 4.7 },
    { name: "AB Fitness - Kaloor", city: "Kochi", state: "Kerala", lat: 9.9894, lng: 76.2998, active: true, rating: 4.5 }
  ];

  const amenitiesOptions = [
    ["WiFi", "Locker Room", "Cardio Zone", "Free Weights", "Shower"],
    ["WiFi", "Locker Room", "Cardio Zone", "Free Weights", "Shower", "CrossFit Area", "Health Cafe"],
    ["WiFi", "Locker Room", "Cardio Zone", "Free Weights", "Shower", "CrossFit Area", "Health Cafe", "Steam & Sauna", "VIP Lounge"]
  ];

  const imagesOptions = [
    "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1593079831268-3381b0db4a77?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=600&auto=format&fit=crop"
  ];

  for (let i = 0; i < locationsData.length; i++) {
    const loc = locationsData[i];
    // Alternate features/images based on index
    const amenities = amenitiesOptions[i % amenitiesOptions.length];
    const imageUrl = imagesOptions[i % imagesOptions.length];
    
    await prisma.gymLocation.create({
      data: {
        name: loc.name,
        city: loc.city,
        state: loc.state,
        address: `${i + 101}, Prestige Arcade, High Street Road, Near Gym Circle, ${loc.city}`,
        phone: `+91 98765 0${(100 + i).toString().slice(1)}`,
        email: `contact.${loc.name.toLowerCase().replace(/\s+/g, "").replace("-", "")}@abfitness.in`,
        lat: loc.lat,
        lng: loc.lng,
        amenities: JSON.stringify(amenities),
        timings: "06:00 AM - 10:00 PM (Mon-Sat), 08:00 AM - 04:00 PM (Sun)",
        rating: loc.rating,
        active: loc.active,
        imageUrl: imageUrl
      }
    });
  }

  console.log(`Successfully seeded ${locationsData.length} gym locations across India.`);
  console.log("Database Seeding finished successfully.");
}

main()
  .catch((e) => {
    console.error("Error running database seed: ", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
