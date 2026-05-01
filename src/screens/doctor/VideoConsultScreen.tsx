import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { VideoCall } from "../../components/video/VideoCall";
import { Loader } from "../../components/ui/Loader";
import { doctorService } from "../../services/doctor.service";
import { colors } from "../../theme/colors";
import { spacing } from "../../theme/spacing";
import { Doctor } from "../../types/doctor";
import { MainStackParamList } from "../../types/navigation";

type Props = NativeStackScreenProps<MainStackParamList, "VideoConsult">;

export function VideoConsultScreen({ route, navigation }: Props) {
  const [doctor, setDoctor] = useState<Doctor | undefined>();
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    (async () => {
      const profile = await doctorService.getDoctorById(route.params.doctorId);
      setDoctor(profile);
    })();
  }, [route.params.doctorId]);

  if (!doctor) {
    return <Loader />;
  }

  return (
    <View style={styles.container}>
      <VideoCall
        doctor={doctor}
        muted={muted}
        onToggleMute={() => setMuted((prev) => !prev)}
        onEndCall={() => navigation.goBack()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.md,
  },
});
