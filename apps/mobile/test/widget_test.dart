import 'package:flutter_test/flutter_test.dart';
import 'package:hifazat/main.dart';

void main() {
  testWidgets('Placeholder screen shows the setup message', (tester) async {
    await tester.pumpWidget(const HifazatApp());
    expect(find.text('Hifazat — setup complete'), findsOneWidget);
    expect(find.text("Don't Let Fear Silence You."), findsOneWidget);
  });
}
