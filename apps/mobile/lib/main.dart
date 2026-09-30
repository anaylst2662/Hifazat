import 'package:flutter/material.dart';

/// Hifazat public app entry point.
///
/// Phase 0 placeholder: confirms the project builds and runs.
/// The real home screen, navigation and Quick Exit arrive in Phase 1.
void main() {
  runApp(const HifazatApp());
}

class HifazatApp extends StatelessWidget {
  const HifazatApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Hifazat',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFF2E7D6B)),
      ),
      home: const SetupCompleteScreen(),
    );
  }
}

class SetupCompleteScreen extends StatelessWidget {
  const SetupCompleteScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final textTheme = Theme.of(context).textTheme;
    return Scaffold(
      body: SafeArea(
        child: Center(
          child: Padding(
            padding: const EdgeInsets.all(24),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Icon(Icons.shield_outlined, size: 72),
                const SizedBox(height: 16),
                Text(
                  'Hifazat — setup complete',
                  style: textTheme.headlineSmall,
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 8),
                Text(
                  "Don't Let Fear Silence You.",
                  style: textTheme.titleMedium,
                  textAlign: TextAlign.center,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
