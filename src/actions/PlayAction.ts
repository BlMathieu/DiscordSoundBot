import { joinVoiceChannel, VoiceConnection } from "@discordjs/voice";
import { ChatInputCommandInteraction, GuildMember, SlashCommandBuilder, SlashCommandOptionsOnlyBuilder } from "discord.js";
import SoundController from "../controller/SoundController";
import AbstractAction from "./AbstractAction";

class PlayAudioAction extends AbstractAction {

    constructor() {
        super("play");
    }

    public canHandle(command: string): boolean {
        return command === "play";
    }

    public getCommand(): SlashCommandOptionsOnlyBuilder {
        const playCommand = new SlashCommandBuilder()
            .setName("play")
            .setDescription("Play a music !")
            .addStringOption(option => option
                .setName("file")
                .setDescription("name of the music file to play")
                .setRequired(true)
            )
            .addNumberOption(input => input
                .setName("speed")
                .setDescription("Set audio reading speed"))
            .addBooleanOption(boolean => boolean
                .setName("loop")
                .setDescription("Set looping"))

        return playCommand;
    }

    public handleAction(interaction: ChatInputCommandInteraction): void {
        const connection = this.getVoiceConnection(interaction);
        const soundController = new SoundController(connection);

        const fileNames = interaction.options
            .getString("file")
            ?.split(',')
            .filter(f => f != "") || [];
        const speed: number = interaction.options.getNumber("speed") || 1;
        const isLoop = interaction.options.getBoolean("loop") || false;

        try {
            soundController.playSound(fileNames[0], speed);
            connection.subscribe(soundController.getPlayer());
            soundController.setIdleListener(fileNames, isLoop, speed);
            interaction.reply("Demande en cours...");
        } catch (error) {
            console.error(error);
            connection.destroy();
        }
    }

    private getVoiceConnection(interaction: ChatInputCommandInteraction): VoiceConnection {
        const member = interaction.member as GuildMember;
        const channel = member.voice.channel;

        if (!channel) throw new Error("Not in vocal channel !");

        const connection = joinVoiceChannel({
            channelId: channel?.id,
            guildId: channel?.guild.id,
            adapterCreator: channel?.guild.voiceAdapterCreator,
            selfDeaf: false,
        });

        return connection;
    }
}

export default PlayAudioAction;