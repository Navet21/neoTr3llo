import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { BoardUser } from '../entities/board-user.entity';

export async function getBoardUser(
  repo: Repository<BoardUser>,
  boardId: string,
  userId: string,
  withRelations = false,
) {
  return repo.findOne({
    where: { board: { id: boardId }, user: { id: userId } },
    relations: withRelations ? { board: true, user: true } : undefined,
  });
}

export async function checkUser(
  repo: Repository<BoardUser>,
  boardId: string,
  userId: string,
) {
  const boardUser = await getBoardUser(repo, boardId, userId);
  if (!boardUser) {
    throw new NotFoundException(
      `User ${userId} is not a member of board ${boardId}`,
    );
  }
  return boardUser;
}

export async function checkOwner(
  repo: Repository<BoardUser>,
  boardId: string,
  userId: string,
) {
  const boardUser = await checkUser(repo, boardId, userId);
  if (!boardUser.isOwner) {
    throw new ForbiddenException('Only the owner can perform this action');
  }
  return boardUser;
}

export function countOwners(repo: Repository<BoardUser>, boardId: string) {
  return repo.countBy({ board: { id: boardId }, isOwner: true });
}
